const Book = require("../model/Book.model");
const cloudinary = require("../config/cloudinary");
exports.createbook = async (req, res) => {
  try {
    const { titile, caption, image, rating } = req.body;
    // Assuming you're using multer and the image is available as req.file
    if (!titile || !caption || !image || !rating) {
      res.status(400).send("Please fill all the fields and upload an image");
    }
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "books",
    });
    const imageUrl = result.secure_url;
    const book = new Book({
      titile,
      caption,
      image: imageUrl, // Cloudinary image URL
      rating,
      // user: req.user._id
    });
    await book.save();
    res.status(201).json({
      message: "Book created successfully",
      book: {
        titile: book.titile,
        caption: book.caption,
        image: book.image,
        rating: book.rating,
      },
    });
  } catch (error) {
    console.log("error:", error.message);
    res.status(500).send("Server error");
  }
};

// get allbooks >infinite loading
exports.getAllbooks = async (req, res) => {
  try {
    const pagenation = req.query.page || 1;
    const booksPerPage = req.query.limit || 5;
    const skip = (pagenation - 1) * booksPerPage;
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(booksPerPage)
      .populate("user", "username profileImage");
    const totalBooks = await Book.countDocuments();
    res.status(200).json({
      message: "Books retrieved successfully",
      books,
      totalBooks,
      currentPage: pagenation,
      booksPerPage,
      totalPages: Math.ceil(totalBooks / booksPerPage),
    });
  } catch (error) {
    console.log("error:", error.message);
    res.status(500).send("Server error");
  }
};

exports.updatebooks = async (req, res) => {
  try {
  } catch (error) {
    console.log("error:", error.message);
    res.status(500).send("Server error");
  }
};
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }
    // check if user is the owner of the book
    if (!book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this book",
      });
    }
   
    //delete image from cloudinary
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
        console.log("Image deleted successfully");
      } catch (deleteError) {
        console.log("error:", deleteError.message);
        res.status(500).send("Server error");
      }
    } 
    
    await book.deleteOne();
    res.status(200).json({
      message: "Book deleted successfully",
    });

  } catch (error) {
    console.log("error:", error.message);
    res.status(500).send("Server error");
  }
};
exports.getIdbooke = async (req, res) => {
  try {
  } catch (error) {
    console.log("error:", error.message);
    res.status(500).send("Server error");
  }
};
// get recommendation books by the logged in user
exports.getuser=async(req,res)=>{
  try{
    const books=await Book.find({user:req.user._id}).sort({createdAt:-1})
    res.status(200).json({
      message:"Book retrieved successfully",
      books
    })
  }catch(error){
    console.log("error:",error.message)
    res.status(500).send("Server error")
  }
}
