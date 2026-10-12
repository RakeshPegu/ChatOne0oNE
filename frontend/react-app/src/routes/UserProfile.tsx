
import { useState } from "react";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import apiRequest from "../lib/apiRequest";
import Swal from "sweetalert2";
import axios from "axios";
import {
  ArrowLeft,
  MessageCircle,
  UserRound,
  Users,
  BriefcaseBusiness,
} from "lucide-react";


interface UserInfo {
  _id: string;
  username: string;
}

function UserProfile() {
  const {userId} = useParams<{userId:string}>()
  const  user = useLoaderData() as UserInfo
  const navigate = useNavigate();

  const [err, setErr] = useState<string | null>(null);
  const [isMessaging, setIsMessaging] = useState(false);

  const handleMessageBtnClick = async () => {
    if (isMessaging) return;
   
    setIsMessaging(true);
    setErr(null);

    try {
      const res = await apiRequest.post(`/chats/${user?._id}`);
      navigate(`/chat/${userId}/message`);
    } catch (error) {
        if (axios.isAxiosError(error)) {    
    
        const message =
          error.response?.data?.message ??
          "Something went wrong. Please try again.";

        setErr(message);

        await Swal.fire({
          title: "Unable to start chat",
          text: message,
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      } else {
        setErr("Something went wrong. Please try again.");
      }
    } finally {
      setIsMessaging(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-gradient-to-r from-slate-900 to-blue-900 text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-4 px-4 sm:px-6">
          <Link
            to="/users"
            aria-label="Back to users"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ArrowLeft size={23} />
          </Link>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold tracking-tight">
              Profile
            </h1>
            <p className="text-xs text-blue-200">
              Discover and connect
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Profile card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-blue-800 via-blue-600 to-indigo-500 sm:h-36" />

          <div className="px-5 pb-7 sm:px-8">
            {/* Avatar */}
            <div className="-mt-12 flex items-end justify-between sm:-mt-14">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-blue-50 text-blue-700 shadow-md sm:h-28 sm:w-28">
                <img
                  src="/profile.png"
                  alt={`${user?.username}'s profile`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <UserRound size={44} className="hidden" />
              </div>

              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Member
              </span>
            </div>

            {/* Username */}
            <div className="mt-4">
              <h2 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
                {user?.username}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Community member
              </p>
            </div>

            {/* Stats */}
            <div className="mt-7 grid grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-100 bg-slate-50 py-4">
              <div className="text-center">
                <p className="text-xl font-bold text-slate-900">12</p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Posts
                </p>
              </div>

              <div className="text-center">
                <p className="text-xl font-bold text-slate-900">124</p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Followers
                </p>
              </div>

              <div className="text-center">
                <p className="text-xl font-bold text-slate-900">10</p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Following
                </p>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-7">
              <div className="mb-3 flex items-center gap-2">
                <BriefcaseBusiness
                  size={18}
                  className="text-blue-600"
                />
                <h3 className="font-semibold text-slate-900">
                  About
                </h3>
              </div>

              <p className="text-sm leading-7 text-slate-600">
                Interested in connecting with people, sharing ideas,
                and discovering new opportunities.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={handleMessageBtnClick}
                disabled={isMessaging}
              >
                <MessageCircle size={19} />
                {isMessaging ? "Opening chat..." : "Message"}
              </button>

              <button
                type="button"
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={() =>
                  Swal.fire({
                    title: "Coming soon",
                    text: "Follow functionality has not been implemented yet.",
                    icon: "info",
                    confirmButtonColor: "#2563eb",
                  })
                }
              >
                <Users size={19} />
                Follow
              </button>
            </div>

            {err && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {err}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default UserProfile;
