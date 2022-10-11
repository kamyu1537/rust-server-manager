import {
  EReportType,
  IMessageHandler,
  IReportMessage,
  RconMessageType,
} from '../lib/webrcon/types';

class ReportHandler implements IMessageHandler<IReportMessage> {
  type: RconMessageType = 'Report';

  handle(data: IReportMessage): void {
    console.log(
      `report ${EReportType[data.Type]}(${data.Type}): ${data.PlayerName}[${
        data.PlayerId
      }]\n${data.Subject}:\n${data.Message}`
    );
  }
}

export default ReportHandler;
