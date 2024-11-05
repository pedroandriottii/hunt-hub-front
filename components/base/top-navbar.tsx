

export default function TopNavbar() {

    return (
        <div className="w-full bg-gray-900 h-20 flex items-center justify-end gap-4 pr-6">
            <div className="w-80 h-3/5 rounded-xl  bg-black flex items-center justify-between border border-blue-400">
                <div className="w-8 h-8 rounded-full ml-4 flex items-center justify-center border border-blue-400">
                    <img src="img/profile.svg" className="w-5" alt="profile" />
                </div>
                <p className="text-white text-sm">the_pragmatic_dev</p>
                <div className="h-full w-1/4 rounded-r-xl flex items-center justify-center border-l border-blue-400">
                    <p className="text-white">lvl.21</p>
                </div>
            </div>
            <div className="w-28 h-3/5 rounded-xl  bg-black flex items-center px-3 justify-between border border-blue-400">
                <img src="img/gold.svg" className="w-6 h-6" alt="gold" />    
                <p className="text-white text-sm">90.000</p>
            </div>
        </div>

    )
}