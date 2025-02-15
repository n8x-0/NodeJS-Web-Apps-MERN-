const ErrorPopup = ({ message }: { message: string }) => {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center easedown">
      <div className="relative overflow-hidden w-80 h-12 rounded-3xl text-2xl font-bold bg-blue-600 flex justify-center items-center">
        <div className="absolute w-full h-full z-10"></div>
        <div className={`absolute -top-32 -left-16 w-32 h-44 rounded-full bg-blue-500 moveright`}></div>
        <div className={`absolute -bottom-32 -right-16 w-36 h-44 rounded-full bg-blue-500 moveleft`}></div>
        <div className="text-base z-10">{message}</div>
      </div>
    </div>
  );
};

export default ErrorPopup;
