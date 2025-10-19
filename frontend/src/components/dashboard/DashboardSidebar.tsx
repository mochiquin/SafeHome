interface DashboardSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  userType?: 'customer' | 'provider';
}

export function DashboardSidebar({ activeSection, onSectionChange, userType = 'customer' }: DashboardSidebarProps) {
  const customerMenuItems = [
    { id: 'profile', label: 'Profile', component: 'ProfileSection' },
    { id: 'bookings', label: 'My Bookings', component: 'BookingsSection' },
    { id: 'new-booking', label: 'Book Service', component: 'NewBookingSection' },
  ];

  const providerMenuItems = [
    { id: 'profile', label: 'Profile', component: 'ProfileSection' },
    { id: 'all-services', label: 'Available Tasks', component: 'AllServicesSection' },
    { id: 'services', label: 'My Services', component: 'ServicesSection' },
  ];

  const menuItems = userType === 'customer' ? customerMenuItems : providerMenuItems;

  return (
    <aside className="border-border hidden w-64 border-r py-6 pr-6 md:block">
      <ul className="-ml-3 space-y-1">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`hover:bg-accent-foreground/10 cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeSection === item.id
                ? 'bg-accent-foreground/5 text-accent-foreground'
                : 'text-muted-foreground'
            }`}
            onClick={() => onSectionChange?.(item.id)}
          >
            <a className="block w-full h-full">{item.label}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
