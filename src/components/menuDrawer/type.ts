import { Tables } from "../../../types/supabase";

export type TMDProps = {
  title: string;
  iconURL: string;
  size: 'sm' | 'lg';
  className?: string;
  isLocked: boolean;
  section?:
  | 'ranks'
  | 'quests'
  | 'friends'
  | 'leaderboard'
  | 'bonus'
  | 'retreat';
  user: Tables<'users'>;
  leaders?: Tables<'users'>[];
  friends?: Tables<'ref_friends'>[];
  quests?: Tables<'quests'>[];
}