/* eslint-disable react/prop-types */
import { Input, Label } from "../components/ui";

const ArticlesSpaces = ({ register, errors, qtyArticles }) => {
  const renderArticleFields = () => {
    let fields = [];
    for (let i = 0; i < qtyArticles; i++) {
      fields.push(
        <div key={i} className="flex gap-4 mb-4">
          <div className="w-1/2 mt-2">
            <Label htmlFor={`articles[${i}].number`}>Nombre del Artículo {i + 1}</Label>
            <Input
              type="text"
              placeholder="Nombre del artículo" 
              {...register(`articles[${i}].number`, { required: "El nombre del articulo es obligatorio" })}
            />
            {errors?.articles?.[i]?.number && (
              <p className="text-red-500 font-medium">{errors.articles[i]?.number?.message}</p>
            )}
          </div>
          <div className="w-1/2 mt-2" >
            <Label htmlFor={`articles[${i}].pages`}>Número de Páginas</Label>
            <Input
              type="number"
              placeholder="Número de páginas"
              {...register(`articles[${i}].pages`, { required: "El número de páginas es obligatorio" })}
            />
            {errors?.articles?.[i]?.pages && (
              <p className="text-red-500 font-medium">{errors.articles[i]?.pages?.message}</p>
            )}
          </div>
        </div>
      );
    }
    return fields;
  };

  return <>{renderArticleFields()}</>;
};

export default ArticlesSpaces;
