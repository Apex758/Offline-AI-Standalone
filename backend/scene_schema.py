"""
Scene Schema System - Structured scene specifications for image generation

This module provides the core data structures and logic for creating structured
scene specifications that bridge image generation and question generation.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
import json
from pathlib import Path
from pydantic import BaseModel, Field


class SceneObject(BaseModel):
    """An object present in a scene"""
    id: str = Field(description="Unique identifier for this object")
    type: str = Field(description="Type/category of object (e.g., 'planet', 'character')")
    name: str = Field(description="Human-readable name")
    properties: Dict[str, Any] = Field(default_factory=dict, description="Object properties")
    visible: bool = Field(default=True, description="Whether object is visible in the scene")
    countable: bool = Field(default=True, description="Whether students can count this object")


class SceneRelationship(BaseModel):
    """A relationship between two objects in a scene"""
    type: str = Field(description="Type of relationship (e.g., 'orbits', 'larger_than')")
    subject: str = Field(description="Subject object ID")
    object: str = Field(description="Object object ID")
    description: str = Field(description="Human-readable description of relationship")


class SceneSpec(BaseModel):
    """Complete scene specification - the source of truth for both image and questions"""
    scene_id: str = Field(description="Unique scene identifier")
    topic_id: str = Field(description="Topic this scene represents")
    subject: str = Field(description="Academic subject")
    grade_level: str = Field(description="Grade level")
    strand: str = Field(description="Curriculum strand")
    objects: List[SceneObject] = Field(description="Objects in the scene")
    relationships: List[SceneRelationship] = Field(default_factory=list, description="Relationships between objects")
    exclusions: List[str] = Field(default_factory=list, description="Things explicitly NOT in scene")
    learning_objectives: List[str] = Field(default_factory=list, description="Educational goals")
    created_at: str = Field(description="ISO timestamp of creation")
    image_preset_id: Optional[str] = Field(default=None, description="Preset used to generate scene")
    style_profile_id: Optional[str] = Field(default=None, description="Style profile used")
    
    def to_natural_language(self) -> str:
        """Convert scene spec to natural language description for question generation"""
        nl_parts = []
        
        # Objects
        visible_objects = [obj for obj in self.objects if obj.visible]
        if visible_objects:
            obj_names = [obj.name for obj in visible_objects]
            nl_parts.append(f"The scene contains: {', '.join(obj_names)}")
        
        # Countable objects
        countable = [obj for obj in visible_objects if obj.countable]
        if countable:
            count_info = f"Students can count {len(countable)} distinct objects: {', '.join(obj.name for obj in countable)}"
            nl_parts.append(count_info)
        
        # Relationships
        if self.relationships:
            rel_strs = [rel.description for rel in self.relationships[:3]]  # Top 3 relationships
            nl_parts.append(f"Key relationships: {'; '.join(rel_strs)}")
        
        # Exclusions
        if self.exclusions:
            nl_parts.append(f"NOT in scene: {', '.join(self.exclusions)}")
        
        return "\n".join(nl_parts)
    
    def validate_question(self, question_text: str) -> tuple[bool, Optional[str]]:
        """
        Validate if a question can be answered from this scene
        
        Returns:
            (is_valid, error_message)
        """
        question_lower = question_text.lower()
        
        # Check if question references excluded items
        for exclusion in self.exclusions:
            if exclusion.lower().replace('_', ' ') in question_lower:
                return False, f"Question references excluded item: {exclusion}"
        
        # Check if question references non-visible objects
        visible_names = {obj.name.lower() for obj in self.objects if obj.visible}
        # This is a simple check - more sophisticated NLP could be added
        
        return True, None


class SceneSchemaBuilder:
    """Builds structured scene specifications from topic presets"""
    
    def __init__(self, presets_path: str = "backend/config/topic_presets.json"):
        # Handle both absolute and relative paths
        if not Path(presets_path).is_absolute():
            # Try relative to this file's directory first
            base_dir = Path(__file__).parent
            self.presets_path = base_dir / "config" / "topic_presets.json"
            # If that doesn't exist, try the provided path
            if not self.presets_path.exists():
                self.presets_path = Path(presets_path)
        else:
            self.presets_path = Path(presets_path)
        
        self.presets = self._load_presets()
    
    def _load_presets(self) -> Dict:
        """Load topic presets from JSON"""
        import logging
        logger = logging.getLogger(__name__)
        
        if not self.presets_path.exists():
            logger.warning(f"Presets file not found: {self.presets_path}")
            logger.warning(f"Current working directory: {Path.cwd()}")
            return {}
        
        try:
            with open(self.presets_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                logger.info(f"✅ Loaded {len(data)} topics from {self.presets_path}")
                return data
        except Exception as e:
            logger.error(f"Error loading presets: {e}")
            return {}
    
    def get_preset(self, topic_id: str, preset_id: str) -> Optional[Dict]:
        """Get a specific preset by topic and preset ID"""
        topic_data = self.presets.get(topic_id)
        if not topic_data:
            return None
        
        for preset in topic_data.get("image_presets", []):
            if preset["id"] == preset_id:
                return preset
        return None
    
    def build_scene_from_preset(
        self,
        topic_id: str,
        preset_id: str,
        style_profile_id: str
    ) -> SceneSpec:
        """
        Build a structured scene specification from a topic preset
        
        Args:
            topic_id: Topic identifier (e.g., "science.grade4.solar_system")
            preset_id: Image preset ID (e.g., "solar_system_overview")
            style_profile_id: Style profile ID (e.g., "cartoon_3d")
        
        Returns:
            SceneSpec with objects, relationships, and exclusions
        
        Raises:
            ValueError: If topic or preset not found
        """
        topic_data = self.presets.get(topic_id)
        if not topic_data:
            raise ValueError(f"Topic {topic_id} not found in presets")
        
        preset = self.get_preset(topic_id, preset_id)
        if not preset:
            raise ValueError(f"Preset {preset_id} not found for topic {topic_id}")
        
        # Generate unique scene ID
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        scene_id = f"scene_{topic_id.replace('.', '_')}_{preset_id}_{timestamp}"
        
        # Convert preset objects to SceneObjects
        scene_objects = []
        for i, obj_type in enumerate(preset.get("objects", [])):
            scene_objects.append(SceneObject(
                id=f"{obj_type}_{i+1:02d}",
                type=obj_type,
                name=obj_type.replace("_", " ").title(),
                properties={"index": i, "source": "preset"},
                visible=True,
                countable=True
            ))
        
        # Build relationships from preset metadata and object types
        relationships = self._infer_relationships(scene_objects, preset)
        
        return SceneSpec(
            scene_id=scene_id,
            topic_id=topic_id,
            subject=topic_data["subject"],
            grade_level=topic_data["grade_band"],
            strand=topic_data["strand"],
            objects=scene_objects,
            relationships=relationships,
            exclusions=preset.get("exclusions", []),
            learning_objectives=[],  # Can be filled from curriculum data
            created_at=datetime.now().isoformat(),
            image_preset_id=preset_id,
            style_profile_id=style_profile_id
        )
    
    def _infer_relationships(
        self, 
        objects: List[SceneObject], 
        preset: Dict
    ) -> List[SceneRelationship]:
        """Infer relationships between objects based on types and preset hints"""
        relationships = []
        rel_types = preset.get("relationships", [])
        
        # Example: orbital relationships for planets
        if "orbiting" in rel_types:
            sun_obj = next((o for o in objects if "sun" in o.type.lower()), None)
            if sun_obj:
                for obj in objects:
                    if obj != sun_obj and "planet" in obj.type.lower():
                        relationships.append(SceneRelationship(
                            type="orbits",
                            subject=obj.id,
                            object=sun_obj.id,
                            description=f"{obj.name} orbits {sun_obj.name}"
                        ))
        
        # Example: size comparisons
        if "relative_size" in rel_types or "size_comparison" in rel_types:
            # Add size relationships based on known patterns
            for i in range(len(objects) - 1):
                if i < len(objects) - 1:
                    relationships.append(SceneRelationship(
                        type="size_relationship",
                        subject=objects[i].id,
                        object=objects[i+1].id,
                        description=f"{objects[i].name} and {objects[i+1].name} can be compared by size"
                    ))
        
        # Example: part-whole relationships for fractions
        if "part_to_whole" in rel_types:
            if len(objects) > 1:
                whole_obj = objects[0]
                for part_obj in objects[1:]:
                    relationships.append(SceneRelationship(
                        type="part_of",
                        subject=part_obj.id,
                        object=whole_obj.id,
                        description=f"{part_obj.name} is part of {whole_obj.name}"
                    ))
        
        return relationships
    
    def scene_to_prompt(self, scene: SceneSpec, style_suffix: str) -> str:
        """
        Convert scene spec to image generation prompt
        
        Args:
            scene: Scene specification
            style_suffix: Style-specific prompt suffix
        
        Returns:
            Complete image generation prompt
        """
        # Build base prompt from visible objects
        visible_objects = [obj for obj in scene.objects if obj.visible]
        object_names = [obj.name for obj in visible_objects]
        
        # Start with a structured description
        if len(object_names) == 1:
            prompt = f"A scene showing {object_names[0]}"
        elif len(object_names) == 2:
            prompt = f"A scene showing {object_names[0]} and {object_names[1]}"
        else:
            prompt = f"A scene showing {', '.join(object_names[:-1])}, and {object_names[-1]}"
        
        # Add relationship context (first 2 relationships)
        if scene.relationships:
            rel_descriptions = [r.description for r in scene.relationships[:2]]
            if rel_descriptions:
                prompt += f", where {', and '.join(rel_descriptions)}"
        
        # Add style suffix
        prompt += style_suffix
        
        return prompt
    
    def get_all_topics(self) -> List[Dict[str, str]]:
        """Get list of all available topics"""
        topics = []
        for topic_id, data in self.presets.items():
            topics.append({
                "topic_id": topic_id,
                "display_name": data.get("display_name", topic_id),
                "subject": data.get("subject", ""),
                "grade_band": data.get("grade_band", ""),
                "preset_count": len(data.get("image_presets", []))
            })
        return topics
    
    def get_presets_for_topic(self, topic_id: str) -> List[Dict]:
        """Get all presets for a given topic"""
        topic_data = self.presets.get(topic_id)
        if not topic_data:
            return []
        return topic_data.get("image_presets", [])


# Utility function for external use
def load_scene_spec_from_json(json_str: str) -> SceneSpec:
    """Load a SceneSpec from JSON string"""
    data = json.loads(json_str)
    return SceneSpec(**data)


def save_scene_spec_to_json(scene: SceneSpec) -> str:
    """Save a SceneSpec to JSON string"""
    return scene.model_dump_json(indent=2)
