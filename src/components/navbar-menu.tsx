import { Link } from "react-router-dom"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function NavbarMenu({ rekap }: { rekap: any[] }) {
    return (
        <NavigationMenu viewport={true}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link to="/">Dashboard</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Rekap</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-4">
                            <li>
                                {rekap.map((rekap) => (
                                    <NavigationMenuLink asChild>
                                        <Link to={`/rekap/${rekap?.nisn}`}>{rekap.school_name}</Link>
                                    </NavigationMenuLink>
                                ))}
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}
