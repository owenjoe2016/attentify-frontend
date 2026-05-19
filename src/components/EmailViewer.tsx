import React from "react";
import DOMPurify from "dompurify";
import { formatEmailAddress } from "../utils/formatEmailAddress";

type EmailViewerProps = {
  subject: string;
  from: string;
  to: string;
  date: string;
  htmlBody: string;
  threadId?: string;
  //expended?: boolean;
  replyFromParent?: string;
  OnHandleReply?: () => void;
};

const EmailViewer: React.FC<EmailViewerProps> = ({
  subject,
  from,
  to,
  date,
  htmlBody,
  //expended,
}) => {
  const sanitizedHtml = DOMPurify.sanitize(htmlBody);
  //const [isExpanded, setIsExpanded] = useState(expended);

  //const toggleExpand = () => setIsExpanded(prev => !prev);

  return (
    <div className="bg-white border border-gray-300 p-4 max-w-5xl mx-auto mb-4">
      <header className="flex justify-between items-start mb-4 border-b border-gray-400 pb-4">
        <div>
          <h2 className="text-xl font-bold mb-2">{subject}</h2>
          <div className="flex gap-3 text-sm text-gray-600">
            <div>
              <span className="font-semibold">From:</span>{" "}
              {formatEmailAddress(from)}
            </div>
            <div>
              <span className="font-semibold">To:</span>{" "}
              {formatEmailAddress(to)}
            </div>
            <div>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(date).toLocaleString()}
            </div>
          </div>
        </div>
      </header>

      <section className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      </section>
    </div>
  );
};

export default EmailViewer;