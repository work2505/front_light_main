import { useData } from "@/controllers/context";
import Image from 'next/image';
import QuestCard from "../quest-card";

export function MDQuests() {

  const { currentRefQuest, quests: myQuests } = useData()!;

  return (
    <div className="w-full h-full max-h-full flex flex-col overflow-auto">
      <div className="w-full inline-flex items-center mb-4 justify-center absolute top-[7%] left-1/2 -translate-x-1/2 -mt-9">
        <Image
          src={'/icons/notification.png'}
          alt="Logo"
          width={128}
          height={128}
          className="w-16 h-16 object-contain"
          draggable={false}
          priority
        />
      </div>
      <div className="w-full flex flex-col">
        <QuestCard
          reward={currentRefQuest.reward}
          title={'Invite your friends!'}
          filePath="referral.png"
          iconURL="email.png"
          action=""
          description={currentRefQuest.description}
          id={currentRefQuest.id}
          level={currentRefQuest.level}
        />
        {myQuests.map((quest) => {
          // alert(JSON.stringify(quest, null, 10))
          return (
            <QuestCard
              id={quest.id}
              key={quest.id}
              title={quest.terms}
              reward={quest.reward}
              link={quest.link}
              iconURL={quest.media.filePath}
              action={quest.link}
              filePath={quest.media.fileName}
              description={quest.description}
            />
          );
        })}
      </div>
    </div>
  );
}