import { useContext } from "react";
import { useNotificationContext } from "../context/NotificationContext.jsx";

export function useNotifications() {
	return useNotificationContext();
}
