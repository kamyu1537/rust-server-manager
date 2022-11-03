import { appendLog } from '../lib/log';
import { EReportType, IMessageHandler, IReportMessage, RconMessageType } from '../lib/webrcon/types';

class ReportHandler implements IMessageHandler<IReportMessage> {
  type: RconMessageType = 'Report';

  handle(data: IReportMessage): void {
    const log = `${data.Type}[${EReportType[data.Type]}] ${data.PlayerName}[${data.PlayerId}]/${data.Subject}: ${
      data.Message
    }`;

    appendLog(log, 'report');
  }
}

export default ReportHandler;
