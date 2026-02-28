function MessageSkelton() {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="skelton h-10 w-10 shrink-0 rounded-full"></div>
        <div className="flex flex-col gap-1">
          <div className="skelton h-4 w-10"></div>
          <div className="skelton h-4 w-10"></div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <div className="flex flex-col gap-1">
          <div className="skelton h-4 w-40"></div>
        </div>
        <div className="skelton h-10 w-10 shrink-0 rounded-full"></div>
      </div>
    </>
  );
}
export default MessageSkelton;
