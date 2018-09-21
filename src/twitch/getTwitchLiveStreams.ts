import axios from 'axios';
import { stringify as stringifyQueryParameters } from 'qs';
import { getTwitchGame, pickTwitchApiKey } from '.';
import { Game } from './getTwitchGame';

export interface Stream {
  community_ids: string[];
  game_id: string;
  id: string;
  language: string;
  pagination: string;
  started_at: string;
  thumbnail_url: string;
  title: string;
  type: string;
  user_id: string;
  viewer_count: number;
  // This will be automatically added :)
  game?: Game;
}

type Payload = { onlineStreams: Stream[]; offlineStreams: number[] };

export const getTwitchLiveStreams = (usersId: number[]): Promise<Payload> => {
  const url = `https://api.twitch.tv/helix/streams?${stringifyQueryParameters({ user_id: usersId })}`;
  const config = {
    headers: { 'Client-ID': pickTwitchApiKey() },
  };

  return new Promise<Payload>(resolve => {
    return axios
      .get(url, config)
      .then(response => response.data)
      .then(({ data }: { data: Stream[] }) => {
        const onlineStreams = data.filter(stream => usersId.includes(Number(stream.user_id)));
        const offlineStreams = usersId.filter(userId => data.every(stream => Number(stream.user_id) !== userId));

        const promises = onlineStreams.map(stream => {
          return getTwitchGame(stream.game_id).then(game => {
            stream.game = game;
          });
        });

        Promise.all(promises).then(() => {
          resolve({ onlineStreams, offlineStreams });
        });
      });
  });
};
