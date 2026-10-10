
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Users,
  ChevronRight,
  UserRound,
  LoaderCircle,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

import ProfileCard from "../cards/profileCard";
import apiRequest from "../lib/apiRequest";

interface UserInfo {
  _id: string;
  username: string;
  email: string;
}

function UserList() {
  const [username, setUsername] = useState("");
  const [matchedUserList, setMatchedUserList] = useState<UserInfo[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitForm = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const query = username.trim();

    if (!query) {
      setMatchedUserList([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await apiRequest.get("/search_users", {
        params: {
          username: query,
        },
      });

      console.log('this is the userInfo', response.data)
      const users: UserInfo[] = Array.isArray(response.data)
        ? response.data
        : response.data.message ?? [];
      console.log('this is the users',users)
      setMatchedUserList(users);
    } catch (error) {
      let message = "Unable to search users. Please try again.";

      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ?? message;
      }

      setMatchedUserList([]);

      await Swal.fire({
        title: "Search failed",
        text: message,
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setUsername("");
    setMatchedUserList([]);
    setHasSearched(false);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 bg-gradient-to-r from-slate-900 to-blue-900 px-5 pb-6 pt-8 text-white shadow-lg sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <Users size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Find people
              </h1>
              <p className="mt-1 text-sm text-blue-100">
                Discover and connect with people
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmitForm}
            className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white p-1.5 shadow-md focus-within:ring-2 focus-within:ring-blue-300"
          >
            <Search
              size={21}
              className="ml-3 shrink-0 text-slate-400"
            />

            <input
              type="search"
              value={username}
              maxLength={25}
              placeholder="Search by username..."
              onChange={(e) => setUsername(e.target.value)}
              className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              aria-label="Search users by username"
            />

            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Search size={17} />
              )}
              Search
            </button>
          </form>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-6 sm:px-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {hasSearched ? "Search results" : "Find someone"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {hasSearched
                ? `${matchedUserList.length} matching users`
                : "Enter a username to find people"}
            </p>
          </div>

          {hasSearched && (
            <button
              type="button"
              onClick={clearSearch}
              className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
            >
              Clear
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
            <LoaderCircle
              size={30}
              className="animate-spin text-blue-600"
            />
            <p className="text-sm">Searching the database...</p>
          </div>
        ) : matchedUserList.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {matchedUserList.map((info) => (
              <li key={info._id}>
                <Link
                  to={`/profile/${info._id}`}
                  className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:gap-4 sm:p-4"
                >
                  <div className="min-w-0 flex-1">
                    <ProfileCard userInfo={info} />
                  </div>

                  <ChevronRight
                    size={20}
                    className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600"
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              {hasSearched ? (
                <Search size={26} />
              ) : (
                <UserRound size={26} />
              )}
            </div>

            <h3 className="text-base font-semibold text-slate-900">
              {hasSearched
                ? "No users found"
                : "Ready to connect?"}
            </h3>

            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
              {hasSearched
                ? "Try a different username and search again."
                : "Search for people by their username to start a conversation."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default UserList;
