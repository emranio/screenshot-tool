import React from 'react';
import { IconSettings, IconKeyboard, IconServer, IconFolder, IconToggleLeft } from '@tabler/icons-react';

const Sidebar = ({ activeSection, onNavigate, hasErrors }) => {
  const navigationItems = [
    {
      id: 'general',
      icon: IconSettings,
      label: 'General',
    },
    {
      id: 'hotkeys',
      icon: IconKeyboard,
      label: 'Hotkeys',
    },
    {
      id: 'ftp',
      icon: IconServer,
      label: 'FTP Settings',
    },
    {
      id: 'local',
      icon: IconFolder,
      label: 'Local Settings',
    },
  ];

  const handleNavClick = (sectionId) => {
    if (hasErrors) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please fix the errors in the current section before navigating away.',
        color: 'red',
      });
      return;
    }
    onNavigate(sectionId);
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar__title">Settings</h2>
      <nav>
        <ul className="sidebar__nav">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id} className="sidebar__nav-item">
                <a
                  href={`#${item.id}`}
                  className={`sidebar__nav-link ${activeSection === item.id ? 'sidebar__nav-link--active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                >
                  <IconComponent className="sidebar__nav-icon" size={20} />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
