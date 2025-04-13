// Mock all Lucide React icons
const mockIcon = ({ className, ...props }) => {
  return `MockedIcon-${props['data-testid'] || 'icon'}`;
};

// Create a mock for each icon
const icons = [
  'KeyRound',
  'Shield',
  'User',
  'Lock',
  'Mail',
  'Eye',
  'EyeOff',
  'Github',
  'Google',
  'LogOut',
  'Menu',
  'X',
  'AlertCircle',
  'Check',
  'ChevronDown',
  'ChevronUp',
  'ChevronLeft',
  'ChevronRight',
  'Plus',
  'Minus',
  'Search',
  'Settings',
  'Bell',
  'Home',
  'Calendar',
  'Clock',
  'Trash',
  'Edit',
  'Copy',
  'Download',
  'Upload',
  'ExternalLink',
  'Info',
  'HelpCircle',
  'MoreHorizontal',
  'MoreVertical',
  'Sun',
  'Moon',
  'Star',
  'Heart',
  'Share',
  'Send',
  'Save',
  'Bookmark',
  'Loader',
  'Refresh',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
];

// Create a mock object with all icons
const iconMocks = {};
icons.forEach(icon => {
  iconMocks[icon] = mockIcon;
});

module.exports = {
  __esModule: true,
  ...iconMocks,
};
