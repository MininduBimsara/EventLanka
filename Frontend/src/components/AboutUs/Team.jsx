export const Team = ({ teamMembers }) => {
  return (
    <section className="px-4 py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-16 text-4xl font-bold text-center text-transparent md:text-5xl bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          Meet Our Team
        </h2>

        <div className="grid gap-8 md:grid-cols-4">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-indigo-900 to-transparent group-hover:opacity-100">
                  <div className="flex justify-center space-x-4">
                    <a href="#" className="text-white hover:text-indigo-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                      </svg>
                    </a>
                    <a href="#" className="text-white hover:text-indigo-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
                      </svg>
                    </a>
                    <a href="#" className="text-white hover:text-indigo-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="text-xl font-bold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-indigo-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
