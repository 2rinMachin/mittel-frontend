import { NavLink } from "react-router-dom";
import { LuMessageCircle, LuUser } from "react-icons/lu";
import dayjs from "../util/dayjs";
import type { Article } from "../schemas/article";

interface ArticleListProps {
  articles: Article[];
}

const ArticleList = ({ articles }: ArticleListProps) => {
  return (
    <ul className="space-y-6">
      {articles.map((a) => (
        <li key={a._id}>
          <NavLink
            to={`/articles/${a._id}`}
            className="block bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
          >
            <h2 className="text-2xl font-semibold mb-2 text-neutral-900">
              {a.title}
            </h2>

            <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-600 mb-3">
              <span>
                <LuUser className="inline mb-1 mr-1" />
                <span className="font-medium text-neutral-800">
                  {a.author.username}
                </span>
              </span>
              <span>&middot;</span>
              <span>{dayjs(a.createdAt).locale("es").fromNow()}</span>
              <span>&middot;</span>
              <LuMessageCircle className="inline mb-1" />
              <span>{a.commentsCount}</span>
            </div>

            {a.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {a.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default ArticleList;
