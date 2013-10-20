module PagesHelper
  def taglines
    ["mustaches", "fart clouds", "stick figures", "unibrows", "angry eyes", "lols", "squiggly smell lines", "crazy hats", "eye patches", "lightening bolts", "hearts"] 
  end
  
  def overlay_images
    img_array = []
    taglines.each do |n|
      name = n.gsub(/[ \.]/, '')
      img_array << '"'+name+'":"'+image_path("#{name}.png")+'" '
    end 
    '{'+ img_array.join(', ') + '}'
  end

end
