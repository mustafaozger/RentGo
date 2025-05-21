//
//  AdminMyProductsTableViewCell.swift
//  RentGo
//
//  Created by Eray İnal on 20.05.2025.
//

import UIKit

class AdminMyProductsTableViewCell: UITableViewCell {

    @IBOutlet weak var productImageView: UIImageView!
    @IBOutlet weak var productTitleLabel: UILabel!
    @IBOutlet weak var productDescriptionLabel: UILabel!
    @IBOutlet weak var productPriceLabel: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        productImageView.layer.cornerRadius = 10
        productImageView.layer.masksToBounds = true
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
