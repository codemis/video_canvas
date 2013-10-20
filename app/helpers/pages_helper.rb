module PagesHelper
  def taglines
    #["mustaches", "fart clouds", "stick figures", "unibrows", "angry eyes", "lols", "squiggly smell lines", "crazy hats", "eye patches", "lightening bolts", "hearts"] 
    ["mustaches", "crazy hats", "angry eyes", "unibrows", "hearts", "stick figures", "turds", "lightening bolts", "eye patches", "fart clouds"] 
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
