import { currentProfile } from "@/lib/current-profile,";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import ServerHeader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server.search";
import { Hash, Mic, Shield, ShieldAlert, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface ServerSideProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <Shield className="h-4 w-4 mr-2 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-indigo-500" />,
};

const ServerSidebar = async ({ serverId }: ServerSideProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels?.filter(
    (channel) => channel?.type === ChannelType?.TEXT
  );
  const audioChannels = server?.channels?.filter(
    (channel) => channel?.type === ChannelType?.AUDIO
  );
  const videoChannels = server?.channels?.filter(
    (channel) => channel?.type === ChannelType?.VIDEO
  );
  const members = server?.members?.filter(
    (member) => member?.profileId !== profile?.id
  );

  const role = server?.members?.find(
    (member) => member?.profileId === profile?.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
      <ServerHeader
        //@ts-expect-error ...
        server={server}
        role={role}
      />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel?.id,
                  name: channel?.name,
                  icon: iconMap[channel?.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel?.id,
                  name: channel?.name,
                  icon: iconMap[channel?.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel?.id,
                  name: channel?.name,
                  icon: iconMap[channel?.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member?.id,
                  name: member?.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>

        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label={"Text Channels"}
            />
            {textChannels?.map((channel) => (
              //@ts-ignore
              <ServerChannel
                key={channel?.id}
                channel={channel}
                role={role}
                //@ts-ignore
                server={server}
              />
            ))}
          </div>
        )}

        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label={"audio Channels"}
            />
            {audioChannels?.map((channel) => (
              //@ts-ignore
              <ServerChannel
                key={channel?.id}
                channel={channel}
                role={role}
                //@ts-ignore
                server={server}
              />
            ))}
          </div>
        )}

        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label={"video Channels"}
            />
            {videoChannels?.map((channel) => (
              //@ts-ignore
              <ServerChannel
                key={channel?.id}
                channel={channel}
                role={role}
                //@ts-ignore
                server={server}
              />
            ))}
          </div>
        )}

        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label={"Members"}
              //@ts-ignore
              server={server}
            />
            {members?.map((member) => (
              <ServerMember
                key={member?.id}
                member={member}
                role={role}
                //@ts-ignore
                server={server}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
