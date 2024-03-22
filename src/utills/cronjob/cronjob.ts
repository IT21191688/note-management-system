import schedule from "node-schedule";
import noteService from "../../services/note-service"; // Import your note service
import { sendEmail } from "../email/email-server";
import emailService from "../email/email-templates";
import userService from "../../services/user-service";
import emailTemplates from "../email/email-templates";
// Function to execute the cron job
export const cronJob = (cronTime: string, callback: () => void) => {
  schedule.scheduleJob(cronTime, callback);
};

const updateNoteStatus = async () => {
  try {
    const notes = await noteService.findAllNotes();
    const currentDate = new Date();

    notes.forEach(async (note: any) => {
      if (note.reminders && note.reminders.date) {
        const reminderDate = new Date(note.reminders.date);

        if (
          reminderDate.getFullYear() === currentDate.getFullYear() &&
          reminderDate.getMonth() === currentDate.getMonth() &&
          reminderDate.getDate() === currentDate.getDate()
        ) {
          await noteService.updateNoteStatus(note._id, "duetoday");

          const user = await userService.findById(note.createdBy);

          if (user != null) {
            const recipientEmail = user.email;
            const htmlBody = emailTemplates.createReminderEmail(note);
            const subject = "Reminder: " + note.title;

            await sendEmail(recipientEmail, subject, htmlBody, null);
          }
        } else if (reminderDate < currentDate) {
          await noteService.updateNoteStatus(note._id, "expired");
        }
      }
    });
  } catch (error) {
    console.error("Error updating note status or sending reminder:", error);
    throw error;
  }
};

// Cron job to run every day at 12:00 AM
export const runDailyJob = () => {
  cronJob("0 0 * * *", async () => {
    try {
      await updateNoteStatus();
    } catch (error) {
      console.error("Error running daily job:", error);
    }
  });
};
