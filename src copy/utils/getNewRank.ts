import { Tables } from '../../types/supabase';

export const getNewRank = (userRank: Tables<'playerRank'>) => {
  let rank: number = 0;

  switch (userRank.rank.name) {
    case 'R0':
      rank = 1;
      break;
    case 'R1':
      rank = 2;
      break;
    case 'R2':
      rank = 3;
      break;
    case 'R3':
      rank = 4;
      break;
    case 'R4':
      rank = 5;
      break;
    case 'R5':
      rank = 6;
      break;
    default:
      break;
  }

  return rank;
};
