const WelcomeContent: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
      <div className="relative max-w-3xl">
        <div className="w-full">
          <h1 className="text-4xl font-extrabold  tracking-tight sm:text-5xl">
            Welcome to Tech Trends
          </h1>
          <p className="mt-6 text-xl ">
            Join our community and experience the future of technology.
          </p>
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold">Up to Date</h3>
                <p className="mt-2 text-[highlight]">
                  Articles are updated regularly to keep you informed.
                </p>
              </div>
              <div className="shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold ">Live chat</h3>
                <p className="mt-2 text-[highlight]">
                  Chat with other users and share your thoughts about the
                  stories of the day.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* add some random content */}
      </div>
    </div>
  );
};

export default WelcomeContent;
