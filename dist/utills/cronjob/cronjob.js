"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDailyJob = exports.cronJob = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const note_service_1 = __importDefault(require("../../services/note-service")); // Import your note service
const email_server_1 = require("../email/email-server");
const user_service_1 = __importDefault(require("../../services/user-service"));
const email_templates_1 = __importDefault(require("../email/email-templates"));
// Function to execute the cron job
const cronJob = (cronTime, callback) => {
    node_schedule_1.default.scheduleJob(cronTime, callback);
};
exports.cronJob = cronJob;
const updateNoteStatus = async () => {
    try {
        const notes = await note_service_1.default.findAllNotes();
        const currentDate = new Date();
        notes.forEach(async (note) => {
            if (note.reminders && note.reminders.date) {
                const reminderDate = new Date(note.reminders.date);
                if (reminderDate.getFullYear() === currentDate.getFullYear() &&
                    reminderDate.getMonth() === currentDate.getMonth() &&
                    reminderDate.getDate() === currentDate.getDate()) {
                    await note_service_1.default.updateNoteStatus(note._id, "duetoday");
                    const user = await user_service_1.default.findById(note.createdBy);
                    if (user != null) {
                        const recipientEmail = user.email;
                        const htmlBody = email_templates_1.default.createReminderEmail(note);
                        const subject = "Reminder: " + note.title;
                        await (0, email_server_1.sendEmail)(recipientEmail, subject, htmlBody, null);
                    }
                }
                else if (reminderDate < currentDate) {
                    await note_service_1.default.updateNoteStatus(note._id, "expired");
                }
            }
        });
    }
    catch (error) {
        console.error("Error updating note status or sending reminder:", error);
        throw error;
    }
};
// Cron job to run every day at 12:00 AM
const runDailyJob = () => {
    (0, exports.cronJob)("0 0 * * *", async () => {
        try {
            await updateNoteStatus();
        }
        catch (error) {
            console.error("Error running daily job:", error);
        }
    });
};
exports.runDailyJob = runDailyJob;
