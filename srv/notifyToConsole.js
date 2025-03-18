const cds = require("@sap/cds");
const LOG = cds.log('notifications');
const { readFile } = require("../lib/utils");

module.exports = class NotifyToConsole extends cds.Service {
  async init() {

    const notificationTypes = readFile(cds.env.requires?.notifications?.types);
    const eventsToListen = notificationTypes.map(notificationType => notificationType.NotificationTypeKey);
    LOG._info && LOG.info(`Listening to events: ${eventsToListen.join(", ")}`);

    this.on(eventsToListen, req => {
      LOG._debug && LOG.debug('Handling notification event:', req.event)
      const notification = req.data; if (!notification) return
      console.log (
        '\n---------------------------------------------------------------\n' +
        'Notification:', req.event,
         notification,
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
