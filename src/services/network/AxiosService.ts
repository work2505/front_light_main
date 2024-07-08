import { getNewRank } from '@/utils/getNewRank';
import { Tables } from '../../../types/supabase';
import { Quest, Rank, Referral, User } from '../../../types/types';

import axios from 'axios';
import $api from '@/http';
const HOST = 'beeverseserver.online';
const protocol = 'https';

export async function collectRefferalProfit(refQuestId: string) {
  const route = `referrals/quest/collect-profit/${refQuestId}`;

  const protocol = 'https';
  const url = `${protocol}://${HOST}/api/${route}`;
  const top = $api
    .post(url)
    .then((response) => response.data)
    .catch((error) => error);

  return top;
}

export async function startFarming() {
  const route = 'farm-profit/start';

  const protocol = 'https';
  const url = `${protocol}://${HOST}/api/${route}`;
  const data = await $api
    .post(url)
    .then((response) => response.data)
    .catch((error) => error);

  console.log(data);
  return data;
}

export async function getTopPlayers(): Promise<User[] | null> {
  const route = 'player/top';

  const protocol = 'https';
  const url = `${protocol}://${HOST}/api/${route}`;
  const top = await $api
    .get(url)
    .then((response) => response.data)
    .catch((error) => error);

  return top;
}
export async function setQuestCompleted(questId: string) {
  const route = `quests/complete-task/${questId}`;

  const protocol = 'https';
  const url = `${protocol}://${HOST}/api/${route}`;
  const data = $api
    .post(url)
    .then((response) => response.data)
    .catch((error) => error);

  return data;
}

export async function getRanks(): Promise<Rank[] | null> {
  const route = 'ranks';

  const protocol = 'https';
  const url = `${protocol}://${HOST}/api/${route}`;

  const ranks = await $api
    .get(url)
    .then((response) => response.data)
    .catch((error) => error);
  return ranks;
}

export async function getPlayerRanks() {
  const route = 'ranks/player';

  const url = `${protocol}://${HOST}/api/${route}`;
  const data = await $api
    .get(url)
    .then((response) => response.data)
    .catch((error) => error);

  return data;
}

export async function updatePlayerRank(currentRank: Tables<'playerRank'>) {
  const data = {
    id: currentRank.id,
    name: currentRank.rank.name,
    bonusAmount: currentRank.rank.bonusAmount,
    requiredAmount: currentRank.rank.requiredAmount,
    description: currentRank.rank.description,
  };

  const route = `ranks/${currentRank.id}`;

  const protocol = 'https';
  const url = `${protocol}://${HOST}/api/${route}`;
  const dated = await $api
    .patch(url, data)
    .then((response) => response.data)
    .catch((error) => error);

  return dated;
}

export async function getUserQuests(): Promise<Quest[] | null> {
  const route = 'quests';

  const protocol = 'https';
  const url = `${protocol}://${HOST}/api/${route}`;
  const { quests } = await $api
    .get(url)
    .then((response) => response.data)
    .catch((error) => error);

  return quests;
}

export async function getPlayerRefQuest() {
  const route = 'referrals/quest';

  const url = `${protocol}://${HOST}/api/${route}`;
  const data = await $api
    .get(url)
    .then((response) => response.data)
    .catch((error) => error);

  console.log(data);

  return data;
}

export async function getFriends(page = 1, take = 10) {
  const route = '/referrals';

  const url = `${protocol}://${HOST}/api${route}?page=${page}&take=${take}`;
  const data = await $api
    .get(url)
    .then((response) => response.data)
    .catch((error) => error);

  console.log(data);

  return data;
}

// Update user data by ID
export async function updateUserBonus(lastHoney: number, EarnedHoney: number) {
  const data = {
    honeyLatest: lastHoney,
    honey: EarnedHoney,
  };
  const route = 'player/balance';

  const url = `${protocol}://${HOST}/api/${route}`;
  const dated = await $api
    .patch(url, data)
    .then((response) => response.data)
    .catch((error) => error);

  return dated;
}

export async function getMeInfo() {
  const route = 'player/me';

  const url = `${protocol}://${HOST}/api/${route}`;
  const data: Tables<'users'> = await $api
    .get<Tables<'users'>>(url)
    .then((response) => response.data)
    .catch((error) => error);

  return data;
}

export async function getReferrals() {
  const route = 'referrals';

  const url = `${protocol}://${HOST}/api/${route}`;

  const data = await $api
    .get(url)
    .then((response) => response.data)
    .catch((error) => error);
  console.log(data);

  return data;
}

export async function setCompletedRefQuest(id: number) {
  const route = `referrals/quest/${id}`;

  const url = `${protocol}://${HOST}/api/${route}`;
  const data = $api
    .patch(url)
    .then((response) => response.data)
    .catch((error) => error);
  console.log(data);

  return data;
}

export async function getReferralQuests() {
  const route = 'referrals/quest';

  const url = `${protocol}://${HOST}/api/${route}`;
  const data = await $api
    .get(url)
    .then((response) => response.data)
    .catch((error) => error);
  console.log(data);

  return data;
}

export async function getPlayerQuests() {
  const route = 'quests/player';

  const url = `${protocol}://${HOST}/api/${route}`;
  const data = await $api
    .get(url)
    .then((response) => response.data)
    .catch((error) => error);
  console.log(data);

  return data;
}
