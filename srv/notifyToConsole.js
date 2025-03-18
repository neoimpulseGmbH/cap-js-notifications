const cds = require("@sap/cds");
const LOG = cds.log('notifications');
const { readFile, buildNotification } = require("../lib/utils");

module.exports = class NotifyToConsole extends cds.Service {
  async init() {

    const notificationTypes = readFile(cds.env.requires?.notifications?.types);
    const eventsToListen = notificationTypes.map(notificationType => notificationType.NotificationTypeKey);
    LOG._info && LOG.info(`Listening to events: ${eventsToListen.join(", ")}`);

    this.on(eventsToListen, req => {
      LOG._debug && LOG.debug('Handling notification event:', req.event)
      const data = req.data;
      const type = data.type
      const message = data.message
      message.type = type
      console.log (
        '\n---------------------------------------------------------------\n' +
        'Notification:', req.event,
        buildNotification(message),
        '\n---------------------------------------------------------------\n',
      )

      const { NotificationTypeKey, NotificationTypeVersion } = notification
      const types = cds.notifications.local.types // REVISIT: what is this?

      if (!(NotificationTypeKey in types)) {
        LOG._warn && LOG.warn(
          `Notification Type ${NotificationTypeKey} is not in the notification types file`
        );
        return;
      }

      if (!(NotificationTypeVersion in types[NotificationTypeKey])) {
        LOG._warn && LOG.warn(
          `Notification Type Version ${NotificationTypeVersion} for type ${NotificationTypeKey} is not in the notification types file`
        );
      }
    })

    return super.init()
  }
}
