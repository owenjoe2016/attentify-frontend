import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import { useNotification } from "../context/NotificationContext";

type SMSReplyProps = {
  threadId?: string;
  replyFromParent: string;
};

const SMSReplySection: React.FC<SMSReplyProps> = ({
  threadId,
  replyFromParent
}) => {
  const [reply, setReply] = useState(replyFromParent);
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { notify } = useNotification();

  useEffect(() => {
    setReply(replyFromParent);
  }, [replyFromParent]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`;
    textarea.style.overflowY = textarea.scrollHeight > 240 ? "auto" : "hidden";
  }, [reply]);

  // Handle reply submit
  const handleReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || ""}/twilio/messages/${threadId}/reply`,
        { content: reply },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setReply("");
      notify("success", "SMS sent.");
    } catch (err) {
      notify("error", "Failed to send SMS.");
    } finally {
      setSending(false);
    }
  };

  const isEditorEmpty = (text: string | undefined) => {
    return !text || text.trim() === '';
  };

  return (
    <div className="mt-4">
      <div className="bg-white  p-4 shadow">
        <h3 className="text-lg font-semibold mb-2">Reply</h3>
        <textarea
          ref={textareaRef}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className="w-full min-h-[80px] max-h-[240px] p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Type your reply here..."
        />
        <button
          className="bg-blue-600 text-white px-6 py-2  hover:bg-blue-700 disabled:opacity-50 mt-2"
          onClick={handleReply}
          disabled={sending || isEditorEmpty(reply)}
        >
          {sending ? "Sending..." : "Send Reply"}
        </button>
      </div>
    </div>
  );
};

export default SMSReplySection;
