
interface BannerProps {
    title: string;
}

const Banner = ({title}: BannerProps) => (
    <div className="text-center">
        <header className="bg-[#282c34] min-h-screen flex flex-col items-center justify-center text-[calc(10px_+_2vmin)] text-white">
            <p className="m-4">{title}</p>
        </header>
    </div>
);

export default Banner;