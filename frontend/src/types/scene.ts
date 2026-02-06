/**
 * Scene Schema Types - TypeScript definitions for structured scene specifications
 * 
 * These types mirror the Python Pydantic models in backend/scene_schema.py
 */

/**
 * An object present in a scene
 */
export interface SceneObject {
  id: string;
  type: string; // e.g., "planet", "character", "fraction_piece"
  name: string; // e.g., "Earth", "protagonist", "half_circle"
  properties: Record<string, unknown>; // e.g., {color: "blue", size: "large"}
  visible: boolean;
  countable: boolean; // Can students count these?
}

/**
 * A relationship between two objects in a scene
 */
export interface SceneRelationship {
  type: string; // e.g., "orbits", "larger_than", "part_of"
  subject: string; // object ID
  object: string; // object ID
  description: string; // Human-readable description
}

/**
 * Complete scene specification - the source of truth for both image and questions
 */
export interface SceneSpec {
  // Identifiers
  scene_id: string;
  topic_id: string;
  
  // Curriculum context
  subject: string;
  grade_level: string;
  strand: string;
  
  // Scene content
  objects: SceneObject[];
  relationships: SceneRelationship[];
  exclusions: string[]; // Things explicitly NOT in scene (prevents hallucination)
  learning_objectives: string[];
  
  // Metadata
  created_at: string; // ISO timestamp
  image_preset_id?: string;
  style_profile_id?: string;
}

/**
 * Topic preset definition
 */
export interface TopicPreset {
  topic_id: string;
  display_name: string;
  subject: string;
  grade_band: string;
  strand: string;
  image_presets: ImagePreset[];
}

/**
 * Image preset definition
 */
export interface ImagePreset {
  id: string;
  name: string;
  description: string;
  base_prompt: string;
  objects: string[];
  relationships: string[];
  exclusions: string[];
  recommended_styles: string[];
}

/**
 * Style profile definition
 */
export interface StyleProfile {
  id: string;
  name: string;
  description: string;
  grade_bands: string[];
  base_prompt_suffix: string;
  negative_prompt: string;
  sdxl_settings: {
    width: number;
    height: number;
    num_inference_steps: number;
    guidance_scale: number;
    cfg_scale: number;
  };
  ip_adapter: {
    enabled: boolean;
    strength: number;
    reference_set: string;
  };
}

/**
 * Scene generation request
 */
export interface SceneGenerationRequest {
  topic_id: string;
  preset_id: string;
  style_profile_id: string;
}

/**
 * Scene generation response
 */
export interface SceneGenerationResponse {
  success: boolean;
  imageData: string; // base64 data URI
  sceneSpec: SceneSpec;
  metadata: {
    topic_id: string;
    preset_id: string;
    style_profile_id: string;
    generated_at: string;
  };
}

/**
 * Utility functions for working with scene specs
 */

/**
 * Convert scene spec to natural language description
 */
export function sceneToNaturalLanguage(scene: SceneSpec): string {
  const parts: string[] = [];
  
  // Objects
  const visibleObjects = scene.objects.filter(obj => obj.visible);
  if (visibleObjects.length > 0) {
    const names = visibleObjects.map(obj => obj.name);
    parts.push(`The scene contains: ${names.join(', ')}`);
  }
  
  // Countable objects
  const countable = visibleObjects.filter(obj => obj.countable);
  if (countable.length > 0) {
    parts.push(`Students can count ${countable.length} distinct objects: ${countable.map(o => o.name).join(', ')}`);
  }
  
  // Relationships
  if (scene.relationships.length > 0) {
    const relStrs = scene.relationships.slice(0, 3).map(r => r.description);
    parts.push(`Key relationships: ${relStrs.join('; ')}`);
  }
  
  // Exclusions
  if (scene.exclusions.length > 0) {
    parts.push(`NOT in scene: ${scene.exclusions.join(', ')}`);
  }
  
  return parts.join('\n');
}

/**
 * Validate if a question can be answered from a scene spec
 */
export function validateQuestion(
  questionText: string,
  scene: SceneSpec
): { isValid: boolean; errorMessage?: string } {
  const questionLower = questionText.toLowerCase();
  
  // Check if question references excluded items
  for (const exclusion of scene.exclusions) {
    const exclusionWords = exclusion.toLowerCase().replace(/_/g, ' ');
    if (questionLower.includes(exclusionWords)) {
      return {
        isValid: false,
        errorMessage: `Question references excluded item: ${exclusion}`
      };
    }
  }
  
  // Question is valid if it doesn't reference excluded items
  // More sophisticated validation could be added here
  return { isValid: true };
}

/**
 * Get countable objects from scene
 */
export function getCountableObjects(scene: SceneSpec): SceneObject[] {
  return scene.objects.filter(obj => obj.visible && obj.countable);
}

/**
 * Get relationships involving a specific object
 */
export function getObjectRelationships(
  scene: SceneSpec,
  objectId: string
): SceneRelationship[] {
  return scene.relationships.filter(
    rel => rel.subject === objectId || rel.object === objectId
  );
}

/**
 * Format scene spec for prompt context
 */
export function formatSceneForPrompt(scene: SceneSpec): string {
  const lines: string[] = [
    'SCENE CONTEXT (Important - use ONLY this information):',
    '',
    'Objects visible in the image:'
  ];
  
  // List objects
  scene.objects
    .filter(obj => obj.visible)
    .forEach(obj => {
      const countableTag = obj.countable ? ' [countable]' : '';
      lines.push(`- ${obj.name} (${obj.type})${countableTag}`);
    });
  
  // List relationships
  if (scene.relationships.length > 0) {
    lines.push('', 'Relationships between objects:');
    scene.relationships.forEach(rel => {
      lines.push(`- ${rel.description}`);
    });
  }
  
  // List exclusions
  if (scene.exclusions.length > 0) {
    lines.push('', 'What is NOT in the scene (do not reference these):');
    scene.exclusions.forEach(ex => {
      lines.push(`- NO ${ex}`);
    });
  }
  
  // Add validation rules
  lines.push(
    '',
    'RULES FOR QUESTION GENERATION:',
    '1. Only reference objects explicitly listed above',
    '2. Only ask about visible, countable objects',
    '3. Respect the relationships described',
    '4. NEVER reference excluded items',
    '5. Questions must be answerable from the scene description alone',
    '6. Do not assume details not explicitly stated'
  );
  
  return lines.join('\n');
}
