

// Footer Component
const Footer = () => {
  return (
    <footer className="py-8 bg-gray-900 border-t border-gray-800">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="mb-4 text-gray-400 md:mb-0">© 2023 Event Ticket Booking Platform. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 transition-colors hover:text-white">Privacy Policy</a>
            <a href="#" className="text-gray-400 transition-colors hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;