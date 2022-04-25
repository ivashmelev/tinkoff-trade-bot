import { client } from './Client';
import moment from 'moment';
import { parseMomentToTimestamp } from './utils/parseMomentToTimestamp';

export class ExchangeSchedule {
  /**
   * Возвращает статус работы биржи
   */
  getStatusIsExchangeOpen(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const from = parseMomentToTimestamp(moment());
      const to = parseMomentToTimestamp(moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 }));

      client.instruments.tradingSchedules({ exchange: process.env.EXCHANGE, from, to }, (error, value) => {
        if (error) reject(error);

        if (value?.exchanges) {
          const { exchanges } = value;
          const [exchange] = exchanges;
          const { isTradingDay, startTime, endTime } = exchange.days[0];
          const nowTime = from;
          const startTimeSeconds = Number(startTime?.seconds) || 0;
          const endTimeSeconds = Number(endTime?.seconds) || 0;
          const nowTimeSeconds = Number(nowTime.seconds) || 0;

          resolve(isTradingDay && nowTimeSeconds > startTimeSeconds && nowTimeSeconds < endTimeSeconds);
        }
      });
    });
  }
}
