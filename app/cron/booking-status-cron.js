const cron = require("node-cron");
const Booking = require("../models/booking-model");
const dayjs = require("../../utils/dayjs-setup");

cron.schedule("* * * * *", async () => {
    try{
        const nowIST = dayjs().tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss");
        console.log(`\n[CRON] Tick at IST: ${nowIST}`);
        const ongoingBookings = await Booking.find({ status: "ongoing" });
        const bookingsToComplete = ongoingBookings.filter((booking) => {
            const end = booking.endDateTime.end; // already string
            const shouldUpdate = end <= nowIST;
            return shouldUpdate;
        })
        if(bookingsToComplete.length > 0) {
            const update = await Booking.updateMany(
                { _id: { $in: bookingsToComplete.map((b) => b._id) } },
                { $set: { status: "completed" } }
            )
            console.log(`[CRON] completed ${update.modifiedCount} bookings.`);
        }else {
            console.log("[CRON] No ongoing bookings to complete");
        }
    } catch(err) {
        console.log(err);
        console.log("[CRON ERROR]", err.message);
        if(err.stack) {
            console.log(err.stack);
        }
    }
})