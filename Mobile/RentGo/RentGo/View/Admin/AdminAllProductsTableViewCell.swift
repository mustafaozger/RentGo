//
//  AdminAllProductsTableViewCell.swift
//  RentGo
//
//  Created by Eray İnal on 19.05.2025.
//

import UIKit

class AdminAllProductsTableViewCell: UITableViewCell {

    @IBOutlet weak var productImageView: UIImageView!
    @IBOutlet weak var productTitleLabel: UILabel!
    @IBOutlet weak var productDescriptionLabel: UILabel!
    @IBOutlet weak var productPriceLabel: UILabel!
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    
    func configure(with product: RentalProduct) {
            productTitleLabel.text = product.productName
            productDescriptionLabel.text = product.description
            
            // Haftalık kiralama varsayımı
            productPriceLabel.text = "\(Int(product.pricePerWeek))$ / W"

            // Görsel varsa yükle
            if let firstImage = product.productImageList.first {
                if let url = URL(string: firstImage.imageUrl) {
                    DispatchQueue.global().async {
                        if let data = try? Data(contentsOf: url) {
                            DispatchQueue.main.async {
                                self.productImageView.image = UIImage(data: data)
                            }
                        }
                    }
                }
            } else {
                self.productImageView.image = UIImage(systemName: "photo")
            }
        }

}
