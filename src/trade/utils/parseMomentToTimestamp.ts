import { Moment } from 'moment';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import { Timestamp as TimestampTinkoff } from '@tinkoff/invest-js/build/generated/google/protobuf/Timestamp';

export const parseMomentToTimestamp = (moment: Moment): TimestampTinkoff => {
  const timestamp = new Timestamp();
  const date = new Date(Number(moment.format('x')));

  timestamp.fromDate(date);

  return timestamp.toObject();
};
