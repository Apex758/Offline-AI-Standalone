import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Mapping: lucide-react name -> hugeicons core-free-icons module name (without "Icon" suffix)
const ICON_MAP = {
  AlertCircle: 'AlertCircle',
  AlertTriangle: 'AlertCircle',
  ArrowUp: 'ArrowUp01',
  ArrowLeft: 'ArrowLeft01',
  ArrowRight: 'ArrowRight01',
  ArrowUpDown: 'SortingDown',
  Atom: 'Atom01',
  Award: 'Award01',
  BarChart: 'BarChart',
  BarChart2: 'BarChart',
  BarChart3: 'BarChart',
  Battery: 'BatteryFull',
  Beaker: 'TestTube',
  Book: 'Book01',
  BookMarked: 'BookBookmark01',
  BookOpen: 'BookOpen01',
  BookText: 'Book01',
  Boxes: 'Package01',
  Briefcase: 'Briefcase01',
  Building: 'Building01',
  Building2: 'Building02',
  Calculator: 'Calculator',
  Calendar: 'Calendar01',
  CalendarDays: 'Calendar01',
  Camera: 'Camera01',
  Car: 'Car01',
  CheckCircle: 'CheckmarkCircle01',
  CheckCircle2: 'CheckmarkCircle01',
  CheckSquare: 'CheckmarkCircle01',
  ChevronDown: 'ArrowDown01',
  ChevronLeft: 'ArrowLeft01',
  ChevronRight: 'ArrowRight01',
  ClipboardCheck: 'CheckList',
  Clock: 'Clock01',
  Cloud: 'Cloud',
  CloudRain: 'Cloud',
  Cog: 'Cog',
  Compass: 'Compass01',
  CuboidIcon: 'Cube',
  Database: 'Database',
  Dice6: 'Dice',
  Dna: 'Dna01',
  DollarSign: 'Dollar01',
  Download: 'Download01',
  Droplets: 'Droplet',
  Ear: 'Ear',
  Eye: 'Eye',
  FileCheck: 'File01',
  FileEdit: 'File01',
  FileImage: 'Image01',
  FileText: 'File01',
  Filter: 'Filter',
  FingerprintIcon: 'Fingerprint',
  FlaskConical: 'TestTube',
  FlaskRoundIcon: 'TestTube',
  Gamepad2: 'GamepadDirectional',
  Gift: 'Gift',
  Globe: 'Globe',
  GraduationCap: 'GraduationScroll',
  Grid3X3: 'Grid',
  Hash: 'Hashtag',
  Headphones: 'Headphones',
  Heart: 'Favourite',
  History: 'Clock01',
  Home: 'Home01',
  Landmark: 'Landmark',
  Leaf: 'Leaf01',
  Library: 'Library',
  Lightbulb: 'Bulb',
  ListChecks: 'CheckList',
  Magnet: 'Magnet',
  Map: 'Maps',
  MapPin: 'Location01',
  MessageCircle: 'Message01',
  MessageSquare: 'Message01',
  Mic: 'Mic01',
  Microscope: 'Microscope',
  Monitor: 'Computer',
  Mountain: 'Mountain',
  Music: 'MusicNote01',
  Navigation: 'Navigation01',
  Package: 'Package01',
  Palette: 'Colors',
  PawPrint: 'ChessPawn',
  Pencil: 'PencilEdit01',
  PenTool: 'PenTool01',
  PieChart: 'PieChart01',
  Play: 'Play',
  Plus: 'PlusSign',
  Printer: 'Printer',
  Puzzle: 'Puzzle',
  Rabbit: 'Sparkles',
  Radio: 'Radio01',
  Recycle: 'Recycle01',
  Repeat: 'Repeat',
  Rocket: 'Rocket01',
  RotateCcw: 'Reload',
  Ruler: 'Ruler',
  Satellite: 'Satellite01',
  Scale: 'WeightScale',
  Search: 'Search01',
  Shapes: 'Shapes',
  Shield: 'Shield01',
  Smartphone: 'Smartphone01',
  Sparkles: 'Sparkles',
  Square: 'Square',
  Star: 'Star',
  Sun: 'Sun01',
  Target: 'Target01',
  Thermometer: 'Thermometer',
  TreesIcon: 'PineTree',
  TrendingUp: 'ChartIncrease',
  Triangle: 'Triangle',
  Users: 'UserGroup',
  Users2: 'UserMultiple',
  Video: 'Video01',
  Volume2: 'VolumeHigh',
  Waves: 'Wave',
  Wind: 'CloudFastWind',
  Wrench: 'Wrench01',
  XCircle: 'CancelCircle',
  Zap: 'Flash',
  // Additional mappings for curriculum pages
  Brain: 'Brain',
  Bug: 'Bug01',
  Cake: 'BirthdayCake',
  ChefHat: 'ChefHat',
  ChevronUp: 'ArrowUp01',
  CloudSnow: 'CloudSnow',
  CloudSun: 'Cloud',
  Construction: 'Construction',
  CreditCard: 'CreditCard',
  Drama: 'MaskTheater01',
  Flower: 'Flower',
  Grid3x3: 'Grid02',
  HelpCircle: 'HelpCircle',
  Hexagon: 'Hexagon',
  LinkIcon: 'Link01',
  Menu: 'Menu01',
  MenuIcon: 'Menu01',
  MinusCircle: 'MinusSignCircle',
  PartyPopper: 'Party',
  PlusCircle: 'PlusSignCircle',
  School: 'School',
  Scissors: 'Scissor01',
  Share2: 'Share01',
  ShoppingCart: 'ShoppingCart01',
  Trophy: 'Award01',
  Utensils: 'KitchenUtensils',
  X: 'Cancel01',
};

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Match the lucide-react import line(s)
  const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"];?\s*\n?/g;
  const match = importRegex.exec(content);
  if (!match) return false;

  // Parse icon names from import
  const rawImports = match[1];
  const iconNames = rawImports.split(',').map(s => s.trim()).filter(Boolean);

  // Build the set of unique icons (handle "X as Y" aliases)
  const icons = [];
  const aliasMap = {};
  for (const item of iconNames) {
    const asMatch = item.match(/^(\w+)\s+as\s+(\w+)$/);
    if (asMatch) {
      icons.push({ original: asMatch[1], alias: asMatch[2] });
    } else {
      icons.push({ original: item, alias: null });
    }
  }

  // Build hugeicons imports
  const hugeImports = [];
  const wrapperDefs = [];
  const seenData = new Set();

  hugeImports.push("import { HugeiconsIcon } from '@hugeicons/react';");

  for (const icon of icons) {
    const hugeName = ICON_MAP[icon.original];
    if (!hugeName) {
      console.error(`  WARNING: No mapping for "${icon.original}" in ${filePath}`);
      continue;
    }
    const dataVar = `${hugeName}IconData`;
    if (!seenData.has(dataVar)) {
      hugeImports.push(`import ${dataVar} from '@hugeicons/core-free-icons/${hugeName}Icon';`);
      seenData.add(dataVar);
    }
    const componentName = icon.alias || icon.original;
    wrapperDefs.push(
      `const ${componentName}: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={${dataVar}} {...p} />;`
    );
  }

  const iconWrapper = `
const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\\d+(?:\\.\\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};`;

  const replacement = hugeImports.join('\n') + '\n' + iconWrapper + '\n\n' + wrapperDefs.join('\n') + '\n';

  content = content.replace(importRegex, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

// Find all files still importing from lucide-react
const result = execSync(
  'grep -rl "lucide-react" --include="*.tsx" --include="*.ts"',
  { cwd: path.resolve('src'), encoding: 'utf8' }
).trim().split('\n').filter(Boolean);

let count = 0;
for (const rel of result) {
  const full = path.resolve('src', rel);
  try {
    if (migrateFile(full)) {
      count++;
      console.log(`Migrated: ${rel}`);
    }
  } catch (e) {
    console.error(`ERROR in ${rel}: ${e.message}`);
  }
}

console.log(`\nDone! Migrated ${count} files.`);
