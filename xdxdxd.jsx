<div ref={priceRef}>
              {price && (
              <div className="mt-4 p-4 bg-[#0073ae] text-white rounded-md shadow-md w-[30%] mx-auto">
                <div className="text-center">
                  <h4 className="text-xl font-bold">Nuevo Cobro</h4>
                  <p className="mt-2">
                    {price > 0
                      ? `${userDetails.name} ${userDetails.lastName}, usted debe esta ${price}$ por sus modificaciones`
                      : `${userDetails.name} ${userDetails.lastName}, usted no debe nada`}
                  </p>
                </div>
                    
                {price > 0 && (
                  <div className="mt-4 text-center">
                    <button onClick={handlePayment} disabled={!price} className="bg-[#ffffff] hover:bg-[#c01d0f] text-[#0073ae] px-4 py-2 rounded font-semibold hover:text-[#fff] tracking-wide duration-300 shadow-md hover:shadow-lg">
                      Pagar
                    </button>
                  </div>
                )}
              </div>
              )}
              </div>