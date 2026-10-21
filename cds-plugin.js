const cds = require("@sap/cds");

if (cds.cli.command === "build") {
    // register build plugin
    cds.build?.register?.("notifications", require("./lib/build"));
} else
    cds.once("served", async () => {
        const { validateNotificationTypes, readFile } = require("./lib/utils");
        const { createNotificationTypesMap } = require("./lib/notificationTypes");
        const { deployNotificationTypes } = require("./lib/content-deployment");
        const LOG = cds.log("notifications");
        const notificationsConfig = cds.env.requires?.notifications ?? {};
        const production = cds.env.profiles?.includes("production");

        require("@sap-cloud-sdk/util").setGlobalLogLevel("error");

        // read notification types
        const notificationTypes = readFile(notificationsConfig.types);
        if (!validateNotificationTypes(notificationTypes)) return;

        if (!production) {
            const notificationTypesMap = createNotificationTypesMap(notificationTypes, true);
            cds.notifications = { local: { types: notificationTypesMap } };
        }

        // Content deployment pushes the types to the SAP Notification service and
        // therefore requires a destination, which the console kind does not have.
        // It must never keep the server from starting, so failures are logged only.
        if (notificationsConfig.kind === "notify-to-console") {
            LOG._debug && LOG.debug("Skipping notification types deployment for kind 'notify-to-console'");
            return;
        }

        try {
            await deployNotificationTypes();
        } catch (error) {
            LOG._warn && LOG.warn(`Could not deploy notification types: ${error.message}`);
        }
    });
