import { useEffect, useState } from "react";
import axios from "axios";
import { Upload, MapPin, Loader2, Send } from "lucide-react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Input from "./ui/Input";

const ComplaintForm = ({ onSuccess }) => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [locationError, setLocationError] = useState(null);

  const getLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        setLocationError("Unable to retrieve your location. Please ensure location services are enabled.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !image || !location) {
      // You might use a toast here ideally
      alert("Please fill all fields and ensure location is enabled");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("description", description);
    formData.append("image", image);
    formData.append("location", JSON.stringify(location));

    try {
      await axios.post("http://localhost:5000/complaints", formData);
      setDescription("");
      setImage(null);
      setIsSubmitting(false);
      onSuccess();
    } catch (err) {
      alert("Failed to submit complaint");
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <Send size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Report Issue</h2>
          <p className="text-sm text-slate-500">Submit a new civic complaint</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
        <div className="flex-1 min-h-[150px]">
          <textarea
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full h-full p-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-slate-50 text-slate-700 placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-4">
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${location ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
            {isLocating ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <MapPin size={20} />
            )}
            <span className="text-sm font-medium">
              {isLocating
                ? "Detecting location..."
                : location
                  ? "Location detected successfully"
                  : "Location not detected"}
            </span>
            {(!location && !isLocating) && (
              <button
                type="button"
                onClick={getLocation}
                className="ml-auto text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded font-semibold transition-colors"
              >
                Retry
              </button>
            )}
          </div>
          {locationError && (
            <div className="text-xs text-red-500 px-1">{locationError}</div>
          )}

          <div className="relative">
            <input
              accept="image/*"
              capture="environment"
              required=""
              className="hidden"
              id="image-upload"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <label
              htmlFor="image-upload"
              className={`block w-full p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${image
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-300 hover:border-slate-400 text-slate-500'
                }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload size={24} />
                <span className="text-sm font-medium">
                  {image ? image.name : "Tap to upload photo"}
                </span>
              </div>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2"
            disabled={isSubmitting || !location}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Submitting...
              </>
            ) : "Submit Complaint"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ComplaintForm;