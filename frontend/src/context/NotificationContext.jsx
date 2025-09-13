import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext.jsx";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
	const { user } = useAuth();
	const [unreadCount, setUnreadCount] = useState(0);
	const [notifications, setNotifications] = useState([]);

	// Fetch unread count
	useEffect(() => {
		const fetchUnread = async () => {
			if (!user) return setUnreadCount(0);
			try {
				const token = localStorage.getItem("token");
				const res = await axios.get(`/api/v1/notifications/${user._id}?limit=100`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const notifs = res.data.data || [];
				setNotifications(notifs);
				setUnreadCount(notifs.filter(n => !n.isRead).length);
			} catch {
				setUnreadCount(0);
			}
		};
		fetchUnread();
	}, [user]);

	// Mark all as read
			const markAllAsRead = async () => {
				if (!user) return;
				try {
					const token = localStorage.getItem("token");
					await axios.post(`/api/v1/notifications/${user._id}/mark-all-read`, {}, {
						headers: { Authorization: `Bearer ${token}` },
					});
					setUnreadCount(0);
				} catch {}
			};

	return (
		<NotificationContext.Provider value={{ unreadCount, setUnreadCount, markAllAsRead }}>
			{children}
		</NotificationContext.Provider>
	);
}

export function useNotificationContext() {
	return useContext(NotificationContext);
}
