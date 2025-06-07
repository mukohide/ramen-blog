import Link from "next/link"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Setting from "./Setting"
import { auth } from '@/auth'

export default async function PrivateHeader() {
    const session = await auth()
    if(!session?.user?.email) throw new Error("不正なリクエストです")
        
  return (
    <header className="border-b bg-red-800 text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/dashboard" legacyBehavior passHref>
                            <NavigationMenuLink className="font-bold text-xl">
                                マイページ
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <Setting session={session} />
        </div>
    </header>
  )
}
