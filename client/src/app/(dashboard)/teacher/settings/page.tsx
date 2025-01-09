import SharedNotificationSettings from "@/components/SharedNotificationSettings";
import React from "react";

const TeacherSettings = () => {
  return (
    <div className="w-3/5">
      <SharedNotificationSettings
        title="Notification Settings"
        subtitle="Manage your notification settings"
      />
    </div>
  );
};

export default TeacherSettings;
