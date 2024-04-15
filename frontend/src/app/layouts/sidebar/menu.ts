import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        label: 'Dashboard',
        icon: 'bxs-home-circle',
        link: '/dashboard',
        role: ['admin','access-dashboard']
    }
]