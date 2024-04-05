$(document).ready(function() {
    let page = window.location.pathname;

    function ajaxCallBack(fajl, callBackFunction) {
        $.ajax({
            url: "json/" + fajl + ".json",
            method: "get",
            dataType: "json",
            success: function(odgovor) {
                callBackFunction(odgovor);
            },
            error: function(jqXHR, exception) {
                let message = "";
                if (jqXHR.status === 0) {
                    message = "Not connected to the internet.";
                } else if (jqXHR.status == 404) {
                    message = "Page not found. [404]";
                } else if (jqXHR.status == 500) {
                    message = "Internal Server Error [500].";
                } else if (exception === "parsererror") {
                    message = "Requested JSON parse failed.";
                } else if (exception === "timeout") {
                    message = "Time out error.";
                } else if (exception === "abort") {
                    message = "Ajax request aborted.";
                } else {
                    message = `Uncaught Error: ${jqXHR.responseText}`;
                }
                $(".ajaxError").html(`<h1>${message}</h1>`);
                $(".ajaxError").addClass("ajaxErrorShow");
            },
        });
    }

    // Adjusting LocalStorage.
    function placeInLocalStorage(name, value) {
        localStorage.setItem(name, JSON.stringify(value));
    }

    // Taking from LocalStorage.
    function takeFromLocalStorage(name) {
        return JSON.parse(localStorage.getItem(name));
    }

    function showPopUp(klasa, message) {
        $(klasa).html(`<p>${message}</p>`);
        $(klasa)
            .show()
            .stop()
            .animate({
                right: "30px",
                opacity: 1
            }, "fast", function() {
                setTimeout(function() {
                    $(klasa).animate({
                            right: "-100px",
                            opacity: 0
                        },
                        "fast",
                        function() {
                            $(this).hide();
                        }
                    );
                }, 2000);
            });
    }

    // Hamb. toggle.
    const hamburger = document.querySelector(".hamburger");
    const menu = document.querySelector(".mobile-nav");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        menu.classList.toggle("active");
    });

    // Navigation rendering.
    ajaxCallBack("navigation", navigationRendering);
    ajaxCallBack("navigation", mobileNavigationRendering);

    function navigationRendering(data) {
        let output = "";
        data.forEach((el) => {
            output += `<li><a href="${el.href}">${el.text}</a></li>`;
        });
        $(".navUl").html(output);
    }

    function mobileNavigationRendering(data) {
        let output = "<ul>";
        data.forEach((el) => {
            output += `<li><a href="${el.href}">${el.text}</a></li>`;
        });
        output += "</ul>";
        $(".mobile-nav").html(output);
    }

    // Footer.
    ajaxCallBack("footerNavigation", outputFooterLinks);

    function outputFooterLinks(data) {
        let output = "<h5>LINKS</h5><ul>";

        data.forEach((p) => {
            output += ` <li>
                            <a href="${p.href}">${p.text}</a>
                        </li>`;
        });
        output += "</ul>";
        $(".links-center").html(output);
    }

    // Footer social icons.
    ajaxCallBack("footerIcons", outputFooterIcons);

    function outputFooterIcons(data) {
        let output = "";

        data.forEach((p) => {
            output += `<a href="${p.href}" target="_blank">
                <i class="fa-brands fa-${p.icon}"></i></a>`;
        });
        $(".social-links").html(output);
    }

    function outputNumberOfThingsInCart() {
        let cart = takeFromLocalStorage("cart");

        if (cart == null) {
            $(".cartNumberOfProducts").html("0");
        } else {
            $(".cartNumberOfProducts").html(cart.length);
        }
    }

    outputNumberOfThingsInCart();

    if (page == "/" || page == "/index.html") {
        // Index page output.
        ajaxCallBack("features", outputFeatures);

        function outputFeatures(data) {
            let output = "";

            data.forEach((p) => {
                output += `<div class="featured-one">
                    <span class="material-symbols-outlined"> ${p.icon} </span>
                    <div class="featured-desc">
                        <p>${p.text}</p>
                    </div>
                </div>`;
            });

            $(".featured-wrapper").html(output);
        }

        // Bestsellers product output.
        ajaxCallBack("bestSellingRims", outputBestsellers);

        function outputBestsellers(data) {
            let output = "";

            for (let i = 0; i < data.length; i++) {
                if (i % 2 == 0) {
                    output += `
                <div class="offer top-offer">
                    <div class="top-img">
                        <img src="img/${data[i]["img"]}" alt="${data[i]["name"]}" />
                    </div>
                    <div class="top-text">
                        <p class="grey-brand">${data[i]["brand"]}</p>
                        <h4>${data[i]["name"]}</h4>
                        <p class="old-price"><span>${data[i]["price"]["oldPrice"]}&euro;</span> ${data[i]["price"]["newPrice"]}&euro;</p>
                        <a href="#" class="bestsellers-btn">SHOP</a>
                    </div>
                </div>
            `;
                } else {
                    output += `
                <div class="offer classic-offer">
                    <div class="classic-img">
                        <img src="img/${data[i]["img"]}" alt="${data[i]["name"]}" />
                    </div>
                    <div class="classic-text">
                        <p class="grey-brand">${data[i]["brand"]}</p>
                        <h4>${data[i]["name"]}</h4>
                        <p class="old-price"><span>${data[i]["price"]["oldPrice"]}&euro;</span> ${data[i]["price"]["newPrice"]}&euro;</p>
                        <a href="#" class="bestsellers-btn">SHOP</a>
                    </div>
                </div>
            `;
                }
            }

            $(".bestsellers-content").html(output);
        }

        // Reviews output.
        ajaxCallBack("reviews", outputReviews);

        function outputReviews(data) {
            let output = "";

            data.forEach((p) => {
                output += `
                    <div class="middle-text ${p.klasa}">
                        <div class="customer-img">
                            <img src="img/${p.image}.jpg" alt="${p.name}" />
                        </div>
                        <div class="customer-text">
                            <p>${p.text}</p>
                        </div>
                        <div class="customer-name">
                            <h4>${p.name}</h4>
                        </div>
                        <div class="customer-job">
                            <p>${p.job}</p>
                        </div>
                    </div>
        `;
            });

            $(".middle-content").html(output);
        }

        // Reviews slider.
        $(".nextArrow").on("click", function() {
            var currentImage = $(".activeImg");
            var nextImg = currentImage.next();
            if (nextImg.length > 0) {
                currentImage.removeClass("activeImg");
                nextImg.addClass("activeImg");
            }
        });

        $(".prevArrow").on("click", function() {
            var currentImage = $(".activeImg");
            var prevImg = currentImage.prev();
            if (prevImg.length > 0) {
                currentImage.removeClass("activeImg");
                prevImg.addClass("activeImg");
            }
        });

        // Brands images output.
        ajaxCallBack("brandNames", outputBrandNames);

        function outputBrandNames(data) {
            let output = "";
            data.forEach((brand) => {
                output += `<div class="brand-img">
                                <img src="img/${brand.img}" alt="${brand.name}" />
                            </div>`;
            });
            $(".brands-imgs").html(output);
        }
    } else if (page == "/shop.html") {
        let errors = [];

        // Placing all products from JSON to LocalStorage.
        ajaxCallBack("rims", function(result) {
            placeInLocalStorage("allProducts", result);
        });

        // Output sort.
        ajaxCallBack("sortType", function(result) {
            let output = "";

            result.forEach((r) => {
                output += `
                <option value="${r.value}">${r.text}</option>
        `;
            });

            $("#ddlSort").html(output);
        });

        // Output checkboxes.
        function outputCheckBoxes(object, DivIdoutput, klasa) {
            let output = "";

            object.forEach((obj) => {
                output += `
                <div class="brand-form-div">
                    <input type="checkbox" name="ch${obj.name}" value="${obj.id}" id="ch${obj.name}" class="ch${klasa}"/>
                    <label for="ch${obj.name}">${obj.name}</label>
                </div>
        `;
            });

            $("." + DivIdoutput).html(output);
        }

        // Output radio buttons.
        function outputRadioButtons(object) {
            let output = "";

            object.forEach((obj) => {
                output += `
                <div class="brand-form-div">
                    <input type="radio" name="rbCollection" value="${obj.id}" id="rb${obj.name}" class="rbCollection"/>
                    <label for="rb${obj.name}">${obj.name}</label>
                </div>
        `;
            });

            $(".collection-filters").html(output);
        }

        ajaxCallBack("rimBrands", function(brands) {
            placeInLocalStorage("allBrands", brands);
            outputCheckBoxes(brands, "brand-filters", "Brand");
        });

        ajaxCallBack("categoryDimensions", function(categories) {
            placeInLocalStorage("allCategories", categories);
            outputCheckBoxes(categories, "category-filters", "Category");
        });

        ajaxCallBack("collectionEdition", function(collections) {
            placeInLocalStorage("allCollections", collections);
            outputRadioButtons(collections);
        });

        // Search by keyword.
        function searchProducts(text) {
            let allProducts = takeFromLocalStorage("allProducts");
            if (!text || text.trim() === "") {
                return allProducts;
            }
            text = text.toLowerCase();
            return allProducts.filter((p) => {
                return (
                    (p.name.toLowerCase().includes(text)) ||
                    (p.brand.toString() === text)
                );
            });
        }
        
        function outputSearchedProducts(products) {
            function showCollectionBrand(id, nameLocalStorage) {
                let objArray = takeFromLocalStorage(nameLocalStorage);

                if (objArray != null) {
                    return objArray.find((o) => o.id == id).name;
                }
            }
            function showCategories(idsCategories) {
                let categories = takeFromLocalStorage("allCategories");
                let array = [];
                idsCategories.forEach((kat) => {
                    array.push(categories.find((k) => k.id == kat).name);
                });
                return array.join(", ");
            }

            let output = "";
            products.forEach((p) => {
                output += `
                    <div class="product">
                        <div class="product-collection ${showCollectionBrand(p.collection, "allCollections").toLowerCase()}-collection">
                            <p>${showCollectionBrand(p.collection, "allCollections")}</p>
                        </div>
                        <div class="product-img">
                            <img src="img/${p.image}" alt="${p.name}" />
                        </div>
                        <div class="product-brand">
                            <p>${showCollectionBrand(p.brand, "allBrands")}</p>
                        </div>
                        <div class="product-name">
                            <h4>${p.name}</h4>
                        </div>
                        <div class="product-category">
                            <p>${showCategories(p.categoryId)}</p>
                        </div>
                        <div class="product-rating">
                            ${showRating(p.rating)}
                        </div>
                        <div class="product-price ${p.price.oldPrice ? "" : "product-price-without-old"}">
                            <p class="old-price"><del>${p.price.oldPrice ? p.price.oldPrice + "€" : ""}</del></p>
                            <p>${p.price.newPrice}€</p>
                        </div>
                        <div class="product-add-to-cart">
                            <input type="button" class="btn-add-to-cart" value="ADD TO CART" data-productid="${p.id}"/>
                        </div>
                    </div>
                `;
            });
            $(".products").html(output);
        }
        
        $("#search-button").on("click", function() {
            let searchText = $("#search-text").val();
            let searchedProducts = searchProducts(searchText);
            outputSearchedProducts(searchedProducts);
        });

        $("#search-text").on("keyup", function(event) {
            if (event.keyCode === 13) { // 13 - Keycode za enter.
                let searchText = $("#search-text").val();
                let searchedProducts = searchProducts(searchText);
                outputSearchedProducts(searchedProducts);
            }
        });

        // Filter by price.
        function filterByPrice(product) {
            errors = 0;
            let minPrice = $("#price-min").val();
            let maxPrice = $("#price-max").val();
            if (minPrice != "0" || maxPrice != "10000") {
                let productToShow = product.filter(
                    (p) => p.price.newPrice >= minPrice && p.price.newPrice <= maxPrice
                );
                if (
                    productToShow.length == 0 ||
                    minPrice === "" ||
                    minPrice === ""
                ) {
                    errors = 1;
                } else {
                    return productToShow;
                }
            }
            return product;
        }

        // Filter by collection and brand.
        function filterByBrandCollection(product, inputClass, jsonProperty) {
            let checked = "";
            let checkedArray = [];
            checked = $("." + inputClass + ":checked");

            if (checked.length != 0) {
                checked.each(function() {
                    checkedArray.push(parseInt($(this).val()));
                });
                if (jsonProperty === "brand") {
                    let filterProduct = product.filter((p) =>
                        checkedArray.includes(p.brand)
                    );
                    if (filterProduct.length == 0) {
                        errors = 1;
                    } else {
                        return filterProduct;
                    }
                } else if (jsonProperty === "collection") {
                    let filterProduct = product.filter((p) =>
                        checkedArray.includes(p.collection)
                    );
                    if (filterProduct.length == 0) {
                        errors = 1;
                    } else {
                        return filterProduct;
                    }
                }
            }
            return product;
        }

        // Filter by category.
        function filterByCategory(product) {
            let checkedCategory = "";
            let checkedArrayCategory = [];
            checkedCategory = $(".chCategory:checked");

            if (checkedCategory.length != 0) {
                checkedCategory.each(function() {
                    checkedArrayCategory.push(parseInt($(this).val()));
                });
                let categoryFilterproduct = product.filter((p) =>
                    p.categoryId.some((katId) => checkedArrayCategory.includes(katId))
                );
                if (categoryFilterproduct.length == 0) {
                    errors = 1;
                } else {
                    return categoryFilterproduct;
                }
            }
            return product;
        }

        // Sort.
        function sortProducts(product) {
            let sortType = $("#ddlSort").val();
            if (sortType !== "0") {
                return product.sort((a, b) => {
                    if (sortType === "price-asc") {
                        return a.price.newPrice < b.price.newPrice ? -1 : 1;
                    }
                    if (sortType === "price-desc") {
                        return a.price.newPrice < b.price.newPrice ? 1 : -1;
                    }
                    if (sortType === "name-az") {
                        return a.name < b.name ? -1 : 1;
                    }
                    if (sortType === "name-za") {
                        return a.name < b.name ? 1 : -1;
                    }
                    if (sortType === "most-popular") {
                        return a.rating < b.rating ? 1 : -1;
                    }
                });
            }
            return product;
        }

        setTimeout(() => {
            function OnChangeFunc(div, event) {
                $(div).on(event, () => {
                    let sviProzvodi = takeFromLocalStorage("allProducts");
                    outputProducts(sviProzvodi);
                });
            }
            OnChangeFunc("#ddlSort", "change");
            OnChangeFunc("#price-min", "keyup");
            OnChangeFunc("#price-max", "keyup");
            OnChangeFunc(".brand-filters", "change");
            OnChangeFunc(".category-filters", "change");
            OnChangeFunc(".collection-filters", "change");

            // Brand and collections output.
            function showCollectionBrand(id, nameLocalStorage) {
                let objArray = takeFromLocalStorage(nameLocalStorage);

                if (objArray != null) {
                    return objArray.find((o) => o.id == id).name;
                }
            }

            // Category output.
            function showCategories(idsCategories) {
                let categories = takeFromLocalStorage("allCategories");
                let array = [];
                idsCategories.forEach((kat) => {
                    array.push(categories.find((k) => k.id == kat).name);
                });
                return array.join(", ");
            }

            // Products output.
            function outputProducts(product) {
                let filteredByPrice = filterByPrice(product);
                let filteredByBrand = filterByBrandCollection(
                    filteredByPrice,
                    "chBrand",
                    "brand"
                );
                let filteredByCategory = filterByCategory(filteredByBrand);
                let filteredByCollection = filterByBrandCollection(
                    filteredByCategory,
                    "rbCollection",
                    "collection"
                );
                let sortirani = sortProducts(filteredByCollection);
                let outputProducts = "";

                if (errors == 0) {
                    $(".products").removeClass("products-errors");
                    sortirani.forEach((p) => {
                        outputProducts += `
                            <div class="product">
                                <div class="product-collection ${showCollectionBrand(p.collection, "allCollections").toLowerCase()}-collection">
                                    <p>${showCollectionBrand(p.collection, "allCollections")}</p>
                                </div>
                                <div class="product-img">
                                    <img src="img/${p.image}" alt="${p.name}" />
                                </div>
                                
                                <div class="product-brand">
                                    <p>${showCollectionBrand(p.brand, "allBrands")}</p>
                                </div>

                                <div class="product-name">
                                    <h4>${p.name}</h4>
                                </div>
                                <div class="product-category">
                                    <p>${showCategories(p.categoryId)}</p>
                                </div>
                                <div class="product-rating">
                                    ${showRating(p.rating)}
                                </div>
                                <div class="product-price ${p.price.oldPrice ? "" : "product-price-without-old"}">
                                    <p class="old-price"><del>${p.price.oldPrice ? p.price.oldPrice + "€" : ""}</del></p>
                                    <p>${p.price.newPrice}€</p>
                                </div>
                                <div class="product-add-to-cart">
                                    <input type="button" class="btn-add-to-cart" value="ADD TO CART" data-productid="${p.id}"/>
                                </div>
                            </div>
                        `;
                    });
                } else {
                    $(".products").addClass("products-errors");
                    outputProducts = "There are no products inside.";
                }

                $(".products").html(outputProducts);
            }

            ajaxCallBack("rims", function(result) {
                outputProducts(result);
            });
        }, 100);

        // Adding to cart.
        setTimeout(() => {
            $(document).on("click", ".btn-add-to-cart", function() {
                let cart = takeFromLocalStorage("cart");
                let allProducts = takeFromLocalStorage("allProducts");
                let clickedProductId = $(this).data("productid");

                if (cart == null) {
                    placeInLocalStorage("cart", [{
                        id: clickedProductId,
                        qty: 1
                    }]);
                    showPopUp(".popup-added", "Added to the cart.");
                } else {
                    let productToAddToCartFromCart = cart.filter(
                        (c) => c.id == clickedProductId
                    );
                    if (productToAddToCartFromCart.length > 0) {
                        cart.map((c) =>
                            c.id == productToAddToCartFromCart[0].id ? c.qty++ : c
                        );
                        placeInLocalStorage("cart", cart);
                        showPopUp(
                            ".popup-added",
                            "Increased quantity of the product."
                        );
                    } else {
                        cart.push({
                            id: clickedProductId,
                            qty: 1
                        });
                        placeInLocalStorage("cart", cart);
                        showPopUp(".popup-added", "Added product to the cart.");
                    }
                }
                outputNumberOfThingsInCart();
            });
        }, 2000);

        // Ratings output.
        function showRating(numberOfStars) {
            let output = "";
            for (let i = 0; i < numberOfStars; i++) {
                output += `<i class="fa-solid fa-star"></i>`;
            }
            return output;
        }
    } else if (page == "/cart.html") {
        // Products of cart output.
        function outputCart() {
            if (takeFromLocalStorage("cart") == null) {
                placeInLocalStorage("cart", []);
            }

            let cart = takeFromLocalStorage("cart");
            let allProducts = takeFromLocalStorage("allProducts");

            if (cart.length == 0) {
                $(".empty-cart").removeClass("empty-cart-display-none");
                $(".table-cart").addClass("cart-display-none");
                $(".total-price").addClass("total-display-none");
                $(".order-form-wrapper").addClass("order-form-wrapper-display-none");
            } else {
                $(".empty-cart").addClass("empty-cart-display-none");
                $(".table-cart").removeClass("cart-display-none");
                $(".total-price").removeClass("total-display-none");
                $(".order-form-wrapper").removeClass("order-form-wrapper-display-none");

                allProducts = allProducts.filter((p) =>
                    cart.find((x) => x.id == p.id)
                );

                let output = "";

                allProducts.forEach((p, index) => {
                    let foundItem = cart.find((c) => c.id == p.id);
                    output += `
                    <tr>
                        <td>${index + 1}</td>
                        <td><img src="img/${p.image}" alt="${p.name}"></td>
                        <td class="td-name">${p.name}</td>
                        <td>${p.price.newPrice} €</td>
                        <td><input type="number" min="1" class="qtyNum" data-idproduct="${
                        p.id
                        }" value="${foundItem ? foundItem.qty : "1"}"></td>
                        <td><a href="#" class="removeItem" data-removeid="${
                        p.id
                        }"><i class="fa-solid fa-trash-can"></i></a></td>
                    </tr> 
            `;
                });

                $(".cart-products").html(output);
            }
        }

        outputCart();
        totalPrice();

        // Total price output.
        function totalPrice() {
            let cartFromLocalStorage = takeFromLocalStorage("cart");

            let allProducts = takeFromLocalStorage("allProducts");

            allProducts = allProducts.filter((p) =>
                cartFromLocalStorage.find((x) => x.id == p.id)
            );

            let total = 0;
            allProducts.forEach((p) => {
                let quantityNow = cartFromLocalStorage.find((x) => x.id == p.id).qty;

                total += quantityNow * p.price.newPrice;
            });

            $(".total-price").html(`<h2>Total Amount: <span>${total}€</span></h2>`);
        }

        // Remove from the cart.
        $(document).on("click", ".removeItem", function(e) {
            e.preventDefault();
            let productToRemoveId = $(this).data("removeid");
            removeItemFromCart(productToRemoveId);
        });

        // Remove items from the cart.
        function removeItemFromCart(productId) {
            let cart = takeFromLocalStorage("cart");

            cart = cart.filter((c) => c.id != productId);

            placeInLocalStorage("cart", cart);
            outputNumberOfThingsInCart();
            outputCart();
            totalPrice();
        }

        // Changing quantity.
        $(document).on("change", ".qtyNum", function() {
            let quantityNow = $(this).val();
            if (quantityNow < 1) {
                quantityNow = 1;
                $(this).val("1");
            } else {
                let productId = $(this).data("idproduct");

                let cart = takeFromLocalStorage("cart");
                cart = cart.map((x) =>
                    x.id == productId ? { ...x,
                        qty: quantityNow
                    } : x
                );

                placeInLocalStorage("cart", cart);
                totalPrice();
            }
        });

        // Reviewing order, checking it.
        let reFirstLastName = /^([A-Z][a-z]{2,11}(\s+[A-Z][a-z]{2,11})*)$/;
        let reAddress = /^[A-Z][a-z]{2,14}(\s+[A-Z][a-z]{2,14})*\s([1-9][0-9]{0,2})|(bb)$/;
        let rePhoneNumber = /^\+\d{1,3}\s\d{6,14}$/;

        // Checking first and last name, adress.
        function checkFirstLastNameAddressPhone(id, regex, errorSpan) {
            let tbValue = $(id).val();

            if (!regex.test(tbValue)) {
                $(id).addClass("redBorderInput");
                $(errorSpan).addClass("showError");
                return true;
            } else {
                $(id).removeClass("redBorderInput");
                $(errorSpan).removeClass("showError");
                return false;
            }
        }

        // Checking buttons.
        function checkRadioButtons() {
            let radioBtns = $(".rbPayment:checked");

            if (radioBtns.length == 0) {
                $(".order-radio").addClass("redBorderInput");
                $(".radioBtnsError").addClass("showError");
                return true;
            } else {
                $(".order-radio").removeClass("redBorderInput");
                $(".radioBtnsError").removeClass("showError");
                return false;
            }
        }

        // Checking dropdown.
        function checkingDropdown() {
            let ddlValue = $("#ddlDelivery").val();

            if (ddlValue === "0") {
                $(".ddlError").addClass("showError");
                return true;
            } else {
                $(".ddlError").removeClass("showError");
                return false;
            }
        }

        function checkingForm() {
            let errors = false;

            errors = checkFirstLastNameAddressPhone("#fNameLName" ,reFirstLastName, ".fNameLNameError");
            errors = checkFirstLastNameAddressPhone("#address", reAddress, ".addressError");
            errors = checkFirstLastNameAddressPhone("#phoneNumber", rePhoneNumber, ".phoneError");
            errors = checkRadioButtons();
            errors = checkingDropdown();

            return errors;
        }

        $("#btnOrder").on("click", function() {
            let errors = false;
            errors = checkingForm();
            if (!errors) {
                $("#orderForm")[0].reset();
                showPopUp(".success-form", "Successfully made an order.");

                placeInLocalStorage("cart", []);
                outputNumberOfThingsInCart();
                outputCart();
                totalPrice();
            }
        });

    } else if (page == "/author.html") {
        ajaxCallBack("author", outputAuthor);

        function outputAuthor(data) {
            let output = "";
            data.forEach(p => {
                output += `
                <p>${p.key}: <span>${p.value}</span></p>
        `;
            });

            $(".author-text").html(output);
        }
    }
});