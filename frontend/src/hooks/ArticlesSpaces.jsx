/* eslint-disable react/prop-types */
import { Input, Label } from "../components/ui";

const ArticlesSpaces = ({ register, errors, qtyArticles }) => {
  const renderArticleFields = () => {
    let fields = [];
    for (let i = 0; i < qtyArticles; i++) {
      fields.push(
        <div key={i} className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor={`articles[${i}].sequence`}>Nombre del Artículo {i + 1}</Label>
            <Input
              type="text"
              placeholder="Nombre del artículo" 
              {...register(`articles[${i}].sequence`, { required: "El nombre del articulo es obligatorio" })}
            />
            {errors?.articles?.[i]?.sequence && (
              <p className="text-red-500 font-medium">{errors.articles[i]?.sequence?.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor={`articles[${i}].pages`}>Número de Páginas</Label>
            <Input
              type="number"
              placeholder="Número de páginas"
              {...register(`articles[${i}].pages`, { required: "El número de páginas es obligatorio" })}
              onWheel={(e) => e.target.blur()}
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
