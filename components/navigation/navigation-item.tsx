"use client"

import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ActionTooltip } from "../action-tooltip"
import { Server } from "@prisma/client"

interface NavigationItemProps {
    server: Server
}

const NavigationItem = ({ server }: NavigationItemProps) => {

    const params = useParams();
    const router = useRouter();

    const onClick = () => {
        router.push(`/servers/${server?.id}`);
    }

  return (
    <ActionTooltip
    side="right"
    align="center"
    label={server.name}
    >
    <button
    onClick={onClick}
    className="group relative flex items-center"
    >
        <div className={cn(
            "absolute left-0 bg-white rounded-r-full transition-all w-[4px]",
            params?.serverId !== server.id && "group-hover:h-[20px]",
            params?.serverId === server.id ? "h-[36px]" : "h-[8px]"
        )} />
        <div className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverId === server.id && "bg-primary/10 text-primary rounded-[16px]"
        )}>
            <Image src={server?.imageUrl} alt="channel" fill />
        </div>
    </button>
    </ActionTooltip>
  )
}

export default NavigationItem