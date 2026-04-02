type Props = {
  ticket: any;
  index: number;
  event: any;
};

const TicketCard = ({ ticket, index, event }: Props) => {
  return (
    <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-blue-500/10 bg-[#0B1E3A] shadow-md hover:shadow-lg transition">
      <div className="flex flex-col-reverse md:flex-row">
        
        <div className="flex-1 p-5">
          <h3 className="text-lg font-semibold text-white truncate md:whitespace-normal">
            {event.title}
          </h3>

          <p className="text-sm text-blue-200/70 mt-1">
            {new Date(event.startTime).toLocaleString()}
          </p>

          {event.location && (
            <p className="text-sm text-blue-300/60 mt-1">
              📍 {event.location}
            </p>
          )}

          <div className="mt-6">
            <p className="text-xs text-blue-300/60">Ticket</p>
            <p className="text-sm text-white font-medium">
              #{index + 1}
            </p>
          </div>

          <div className="mt-3">
            <p className="text-xs text-blue-300/60">Ticket ID</p>
            <p className="text-xs text-blue-200/50 break-all">
              {ticket.id}
            </p>
          </div>
        </div>

        <div className="h-px md:h-auto md:w-px bg-blue-400/10 mx-5 md:mx-0 md:my-4" />

        <div className="w-full md:w-44 flex items-center justify-center p-4 bg-[#0A192F]">
          <div className="bg-white p-2 rounded-lg">
            <img
              src={ticket.qrCode}
              alt="QR"
              className="w-32 h-32 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;