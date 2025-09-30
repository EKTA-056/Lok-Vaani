
interface HeaderProps {
    text: string;
}

export const Header: React.FC<HeaderProps> = ({ text }) => {
    return (
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 font-sans">
             {text}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>
    )
}