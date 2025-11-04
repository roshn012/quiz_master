function Loader() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-16">
      <div className="loader">
        <div></div>
      </div>
      <p className="text-center text-gray-600 mt-6 text-lg">
        Generating your custom quiz with AI...
      </p>
    </div>
  );
}

export default Loader;

