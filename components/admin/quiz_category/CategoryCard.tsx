// "use client";

// import { Edit, Trash2 } from "lucide-react";
// import {
//   Button,
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui";
// import { useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
// import {
//   fetchQuizCategories,
//   deleteQuizCategory,
//   fetchQuizzesByCategory,
// } from "@/src/store/slices/quizSlice";
// import { useRouter } from "next/navigation";

// interface Category {
//   id: string;
//   name: string;
//   total_quizzes: number;
//   created_at: string;
//   updated_at: string;
// }

// interface CategoryCardProps {
//   category: Category;
//   onEdit: (category: Category) => void;
//   onDelete: (categoryId: string) => void;
//   onClick?: () => void;
// }

// const colorClasses = {
//   brown: "bg-amber-100 text-amber-800",
//   yellow: "bg-yellow-100 text-yellow-800",
//   red: "bg-red-100 text-red-800",
// };

// export default function CategoryCard({
//   category,
//   onEdit,
//   onDelete,
//   onClick,
// }: CategoryCardProps) {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const categories = useAppSelector((state) => state.quizzes.categories);

//   useEffect(() => {
//     dispatch(fetchQuizCategories());
//   }, [dispatch]);

//   const handleDelete = (categoryId: string) => {
//     dispatch(deleteQuizCategory(categoryId));
//     if (onDelete) onDelete(categoryId);
//   };

//   const handleCardClick = () => {
//     if (onClick) {
//       onClick();
//     } else {
//       // Default: Fetch quizzes for this category and redirect
//       dispatch(fetchQuizzesByCategory({ categoryId: category.id })).then(() => {
//         router.push("/admin/quizzes");
//       });
//     }
//   };

//   return (
//     <div
//       className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
//       onClick={handleCardClick}
//     >
//       <div className="flex items-start justify-between mb-4">
//         {/* <div className={`p-3 rounded-lg ${colorClasses[category.color]}`}>
//           <Briefcase className="w-6 h-6" />
//         </div> */}
//         <div className="justify-between mb-1">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={(e) => {
//               e.stopPropagation();
//               onEdit(category);
//             }}
//           >
//             <Edit className="w-3 h-3" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleDelete(category.id);
//             }}
//           >
//             <Trash2 className="w-3 h-3" />
//           </Button>
//         </div>
//       </div>

//       <h3 className="text-xl font-semibold text-gray-900 mb-2">
//         {category.name}
//       </h3>
//       {/* <p className="text-gray-600 mb-4 text-sm">{category.description}</p> */}

//       <div className="flex items-center justify-between text-sm text-gray-500">
//         <span>{category.total_quizzes} quizzes</span>
//         <span>Updated {category.updated_at}</span>
//       </div>
//     </div>
//   );
// }
"use client";

import { Edit, Trash2, BarChart3, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  fetchQuizCategories,
  deleteQuizCategory,
  fetchQuizzesByCategory,
} from "@/src/store/slices/quizSlice";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  total_quizzes: number;
  created_at: string;
  updated_at: string;
}

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onClick?: () => void;
}

const colorVariants = [
  "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-150",
  "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-150",
  "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:from-amber-100 hover:to-amber-150",
  "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-150",
  "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 hover:from-rose-100 hover:to-rose-150",
];

const iconColors = [
  "text-blue-600 bg-blue-100",
  "text-amber-600 bg-amber-100",
  "text-purple-600 bg-purple-100",
];

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
  onClick,
}: CategoryCardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const categories = useAppSelector((state) => state.quizzes.categories);

  useEffect(() => {
    dispatch(fetchQuizCategories());
  }, [dispatch]);

  const handleDelete = (categoryId: string) => {
    dispatch(deleteQuizCategory(categoryId));
    if (onDelete) onDelete(categoryId);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      dispatch(fetchQuizzesByCategory({ categoryId: category.id })).then(() => {
        router.push("/admin/quizzes");
      });
    }
  };

  const colorIndex =
    Number.parseInt(category.id.slice(-1), 36) % colorVariants.length;
  const cardVariant = colorVariants[colorIndex];
  const iconVariant = iconColors[colorIndex];

  return (
    <div
      className={`bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden`}
      onClick={handleCardClick}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${iconVariant} shadow-sm`}>
            <BarChart3 className="w-6 h-6" />
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(category);
              }}
              className="h-8 w-8 p-0 hover:bg-white/80 text-gray-600 hover:text-blue-600"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(category.id);
              }}
              className="h-8 w-8 p-0 hover:bg-white/80 text-gray-600 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
            {category.name}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <BarChart3 className="w-4 h-4 mr-1" />
            <span className="font-medium">{category.total_quizzes}</span>
            <span className="ml-1">
              {category.total_quizzes === 1 ? "quiz" : "quizzes"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-1" />
            <span>
              Updated {new Date(category.updated_at).toLocaleDateString()}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </div>
    </div>
  );
}
